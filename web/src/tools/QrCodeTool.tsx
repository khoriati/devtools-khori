import { useEffect, useId, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import QRCode from 'qrcode';
import type { QRCodeErrorCorrectionLevel } from 'qrcode';
import { useTranslation } from 'react-i18next';
import OutputBlock from '../components/OutputBlock';
import { useSettings } from '../context/SettingsContext';

// Everything here runs in the browser: the `qrcode` library encodes the payload
// into a <canvas> (PNG) and into an SVG string. Nothing is sent to the server.

type Mode = 'url' | 'contact' | 'text';
const MODES: Mode[] = ['url', 'contact', 'text'];
const LEVELS: QRCodeErrorCorrectionLevel[] = ['L', 'M', 'Q', 'H'];
const SIZES = [128, 256, 512, 1024];
// QR version 40 holds at most 2953 bytes (level L); keep a sane cap for the UI.
const MAX_BYTES = 2900;

type Contact = {
  firstName: string;
  lastName: string;
  org: string;
  title: string;
  phone: string;
  mobile: string;
  email: string;
  website: string;
  address: string;
  note: string;
};

const EMPTY_CONTACT: Contact = {
  firstName: '',
  lastName: '',
  org: '',
  title: '',
  phone: '',
  mobile: '',
  email: '',
  website: '',
  address: '',
  note: '',
};

const CONTACT_FIELDS: { key: keyof Contact; type?: string; multiline?: boolean; autoComplete?: string }[] = [
  { key: 'firstName', autoComplete: 'given-name' },
  { key: 'lastName', autoComplete: 'family-name' },
  { key: 'org', autoComplete: 'organization' },
  { key: 'title', autoComplete: 'organization-title' },
  { key: 'phone', type: 'tel', autoComplete: 'tel' },
  { key: 'mobile', type: 'tel', autoComplete: 'tel' },
  { key: 'email', type: 'email', autoComplete: 'email' },
  { key: 'website', type: 'url', autoComplete: 'url' },
  { key: 'address', multiline: true, autoComplete: 'street-address' },
  { key: 'note', multiline: true },
];

/** Escape a vCard 3.0 text value (RFC 2426 §2.4.2 / RFC 6350 §3.4). */
const vEscape = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');

/** Build a vCard 3.0 payload (the format phone cameras recognise best). */
export function buildVCard(c: Contact): string {
  const lines = ['BEGIN:VCARD', 'VERSION:3.0'];
  const first = c.firstName.trim();
  const last = c.lastName.trim();
  lines.push(`N:${vEscape(last)};${vEscape(first)};;;`);
  lines.push(`FN:${vEscape([first, last].filter(Boolean).join(' '))}`);
  if (c.org.trim()) lines.push(`ORG:${vEscape(c.org.trim())}`);
  if (c.title.trim()) lines.push(`TITLE:${vEscape(c.title.trim())}`);
  if (c.phone.trim()) lines.push(`TEL;TYPE=WORK,VOICE:${vEscape(c.phone.trim())}`);
  if (c.mobile.trim()) lines.push(`TEL;TYPE=CELL:${vEscape(c.mobile.trim())}`);
  if (c.email.trim()) lines.push(`EMAIL;TYPE=INTERNET:${vEscape(c.email.trim())}`);
  if (c.website.trim()) lines.push(`URL:${vEscape(c.website.trim())}`);
  if (c.address.trim()) lines.push(`ADR;TYPE=WORK:;;${vEscape(c.address.trim())};;;;`);
  if (c.note.trim()) lines.push(`NOTE:${vEscape(c.note.trim())}`);
  lines.push('END:VCARD');
  return lines.join('\r\n');
}

/** Normalise a URL: add https:// when the scheme is missing; '' when invalid. */
const HOSTNAME_RE = /^(\[[0-9a-f:.]+\]|[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*)$/i;

export function normalizeUrl(raw: string): string {
  const v = raw.trim();
  // A URL never contains whitespace; Chromium would otherwise percent-encode it.
  if (!v || /\s/.test(v)) return '';
  const withScheme = /^[a-z][a-z0-9+.-]*:/i.test(v) ? v : `https://${v}`;
  try {
    const u = new URL(withScheme);
    if (['http:', 'https:', 'ftp:'].includes(u.protocol)) {
      // Chromium is lenient with hosts (e.g. it accepts spaces); validate explicitly.
      // IDN hosts are already punycoded (xn--) by the URL parser at this point.
      if (!HOSTNAME_RE.test(u.hostname)) return '';
      return u.href;
    }
    if (['mailto:', 'tel:'].includes(u.protocol)) return u.pathname ? u.href : '';
    return '';
  } catch {
    return '';
  }
}

function downloadBlob(blob: Blob, filename: string) {
  const href = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = href;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Give the browser a moment to start the download before revoking.
  window.setTimeout(() => URL.revokeObjectURL(href), 1000);
}

export default function QrCodeTool() {
  const { t } = useTranslation();
  const { announce } = useSettings();
  const modeLabelId = useId();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [mode, setMode] = useState<Mode>('url');
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [contact, setContact] = useState<Contact>(EMPTY_CONTACT);
  const [level, setLevel] = useState<QRCodeErrorCorrectionLevel>('M');
  const [size, setSize] = useState(256);
  const [svg, setSvg] = useState('');
  const [error, setError] = useState('');

  // The exact string encoded into the QR code, derived from the active mode.
  const payload = useMemo(() => {
    if (mode === 'url') return normalizeUrl(url);
    if (mode === 'contact') {
      const hasAny = Object.values(contact).some((v) => v.trim());
      return hasAny ? buildVCard(contact) : '';
    }
    return text;
  }, [mode, url, text, contact]);

  const urlInvalid = mode === 'url' && url.trim() !== '' && payload === '';
  const byteLength = useMemo(() => new TextEncoder().encode(payload).length, [payload]);
  const tooLong = byteLength > MAX_BYTES;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!payload || tooLong) {
      canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
      canvas.width = 0;
      canvas.height = 0;
      setSvg('');
      setError('');
      return;
    }
    let active = true;
    const opts = { errorCorrectionLevel: level, margin: 2, width: size };
    Promise.all([QRCode.toCanvas(canvas, payload, opts), QRCode.toString(payload, { ...opts, type: 'svg' })])
      .then(([, svgText]) => {
        if (!active) return;
        setSvg(svgText);
        setError('');
      })
      .catch(() => {
        if (!active) return;
        setSvg('');
        setError(t('tools.qrcode.encodeError'));
      });
    return () => {
      active = false;
    };
  }, [payload, level, size, tooLong, t]);

  const ready = Boolean(payload) && !tooLong && !error;
  const fileBase = `qrcode-${mode}`;

  const downloadPng = () => {
    canvasRef.current?.toBlob((blob) => {
      if (!blob) return;
      downloadBlob(blob, `${fileBase}.png`);
      announce(t('tools.qrcode.downloaded', { file: `${fileBase}.png` }));
    }, 'image/png');
  };

  const downloadSvg = () => {
    if (!svg) return;
    downloadBlob(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }), `${fileBase}.svg`);
    announce(t('tools.qrcode.downloaded', { file: `${fileBase}.svg` }));
  };

  const updateContact = (key: keyof Contact, value: string) => setContact((c) => ({ ...c, [key]: value }));

  return (
    <Box>
      <Stack spacing={2}>
        <FormControl component="fieldset">
          <FormLabel id={modeLabelId} component="legend">
            {t('tools.qrcode.mode')}
          </FormLabel>
          <RadioGroup
            row
            aria-labelledby={modeLabelId}
            name="qr-mode"
            value={mode}
            onChange={(e) => setMode(e.target.value as Mode)}
          >
            {MODES.map((m) => (
              <FormControlLabel key={m} value={m} control={<Radio />} label={t(`tools.qrcode.modes.${m}`)} />
            ))}
          </RadioGroup>
        </FormControl>

        {mode === 'url' && (
          <TextField
            type="url"
            label={t('common.url')}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            fullWidth
            autoComplete="url"
            placeholder="https://exemplo.com.br"
            inputProps={{ spellCheck: false }}
            error={urlInvalid}
            helperText={urlInvalid ? t('tools.qrcode.invalidUrl') : t('tools.qrcode.urlHelp')}
          />
        )}

        {mode === 'contact' && (
          <Box component="fieldset" sx={{ border: 0, p: 0, m: 0 }}>
            <Typography component="legend" variant="h3" sx={{ mb: 1 }}>
              {t('tools.qrcode.contactHeading')}
            </Typography>
            <Grid container spacing={2}>
              {CONTACT_FIELDS.map((f) => (
                <Grid item xs={12} sm={f.multiline ? 12 : 6} key={f.key}>
                  <TextField
                    label={t(`tools.qrcode.contact.${f.key}`)}
                    value={contact[f.key]}
                    onChange={(e) => updateContact(f.key, e.target.value)}
                    type={f.type ?? 'text'}
                    fullWidth
                    multiline={f.multiline}
                    minRows={f.multiline ? 2 : undefined}
                    autoComplete={f.autoComplete ?? 'off'}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {mode === 'text' && (
          <TextField
            label={t('tools.qrcode.text')}
            value={text}
            onChange={(e) => setText(e.target.value)}
            fullWidth
            multiline
            minRows={4}
            autoComplete="off"
            helperText={t('common.charCount', { count: text.length })}
          />
        )}

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            select
            label={t('tools.qrcode.level')}
            value={level}
            onChange={(e) => setLevel(e.target.value as QRCodeErrorCorrectionLevel)}
            helperText={t('tools.qrcode.levelHelp')}
            sx={{ minWidth: 260 }}
          >
            {LEVELS.map((l) => (
              <MenuItem key={l} value={l}>
                {t(`tools.qrcode.levels.${l}`)}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label={t('tools.qrcode.size')}
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            sx={{ minWidth: 180 }}
          >
            {SIZES.map((s) => (
              <MenuItem key={s} value={s}>
                {s} × {s} px
              </MenuItem>
            ))}
          </TextField>
        </Stack>

        {tooLong && <Alert severity="error">{t('tools.qrcode.tooLong', { max: MAX_BYTES, count: byteLength })}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
      </Stack>

      <Box component="section" aria-label={t('tools.qrcode.preview')} sx={{ mt: 3 }}>
        <Typography component="h3" variant="h3" sx={{ mb: 1 }}>
          {t('tools.qrcode.preview')}
        </Typography>
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            // The QR code must stay black-on-white in every theme (incl. high
            // contrast and forced-colors) so cameras can read it.
            bgcolor: '#fff',
            forcedColorAdjust: 'none',
          }}
        >
          {/* A single canvas is always mounted so the drawing effect has a stable target. */}
          <canvas
            ref={canvasRef}
            role="img"
            aria-label={t('tools.qrcode.canvasLabel', { mode: t(`tools.qrcode.modes.${mode}`) })}
            style={{ maxWidth: '100%', height: 'auto', imageRendering: 'pixelated', display: ready ? 'block' : 'none' }}
          />
          {!ready && <Typography sx={{ color: '#000' }}>{t('tools.qrcode.emptyHint')}</Typography>}
        </Paper>
        {/* Buttons live outside the forced-white box so they keep the theme's contrast. */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mt: 2 }}>
          <Button variant="contained" onClick={downloadPng} disabled={!ready} startIcon={<DownloadIcon />}>
            {t('tools.qrcode.downloadPng')}
          </Button>
          <Button variant="outlined" onClick={downloadSvg} disabled={!ready} startIcon={<DownloadIcon />}>
            {t('tools.qrcode.downloadSvg')}
          </Button>
        </Stack>
      </Box>

      <OutputBlock label={t('tools.qrcode.payload')} value={payload} monospace />
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1, maxWidth: '72ch' }}>
        {t('tools.qrcode.privacy')}
      </Typography>
    </Box>
  );
}
