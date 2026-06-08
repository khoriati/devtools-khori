import { useEffect, useRef } from 'react';
import { Box, Breadcrumbs, Link as MuiLink, Typography } from '@mui/material';
import { Link, useParams, Navigate, useNavigationType } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getTool } from '../tools/registry';
import { useSettings } from '../context/SettingsContext';

export default function ToolView() {
  const { id } = useParams();
  const { t } = useTranslation();
  const { announce } = useSettings();
  const navType = useNavigationType();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const tool = getTool(id);

  useEffect(() => {
    if (!tool) return;
    document.title = `${t(`tools.${tool.id}.name`)} — ${t('app.title')}`;
    announce(t(`tools.${tool.id}.name`));
    // On real navigation (PUSH), move focus to the heading so activating a tool
    // with Enter "enters" it. Deferred to the next frame for reliability across
    // browsers; skipped on first load (POP) so the skip link stays first.
    if (navType !== 'PUSH') return;
    const raf = requestAnimationFrame(() => headingRef.current?.focus());
    return () => cancelAnimationFrame(raf);
  }, [tool, t, announce, navType]);

  if (!tool) return <Navigate to="/" replace />;

  return (
    <Box>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 1 }}>
        <MuiLink component={Link} to="/">
          {t('nav.home')}
        </MuiLink>
        <Typography color="text.primary">{t(`tools.${tool.id}.name`)}</Typography>
      </Breadcrumbs>

      <Typography
        component="h1"
        variant="h1"
        tabIndex={-1}
        ref={headingRef}
        // Visible focus ring on programmatic focus (see HomePage for the rationale).
        sx={(theme) => ({
          borderRadius: '4px',
          '&:focus': { outline: `3px solid ${theme.palette.primary.main}`, outlineOffset: '4px' },
        })}
      >
        {t(`tools.${tool.id}.name`)}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '72ch', mb: 3 }}>
        {t(`tools.${tool.id}.desc`)}
      </Typography>

      {tool.render()}
    </Box>
  );
}
