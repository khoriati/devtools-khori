# --- Stage 1: build the React frontend -------------------------------------
FROM node:20-bookworm-slim AS web
WORKDIR /web
COPY web/package.json web/package-lock.json* ./
RUN npm install --no-audit --no-fund
COPY web/ ./
RUN npm run build

# --- Stage 2: runtime (Node API + network CLIs + static frontend) -----------
FROM node:20-bookworm-slim AS runtime
ENV NODE_ENV=production
# Network diagnostic tools used by the backend API.
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
     whois traceroute iputils-ping dnsutils curl ca-certificates libcap2-bin netbase \
  && rm -rf /var/lib/apt/lists/* \
  # Grant raw-socket capability so ping/traceroute work as a non-root user.
  && setcap cap_net_raw+ep "$(readlink -f "$(command -v ping)")" \
  && setcap cap_net_raw+ep "$(readlink -f "$(command -v traceroute)")" || true

WORKDIR /app
COPY server/package.json server/package-lock.json* ./
RUN npm install --omit=dev --no-audit --no-fund
COPY server/ ./
COPY --from=web /web/dist ./public

# Run unprivileged.
RUN useradd --system --uid 10001 appuser
USER appuser

ENV PORT=8080 STATIC_DIR=/app/public
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
  CMD node -e "fetch('http://127.0.0.1:8080/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "index.js"]
