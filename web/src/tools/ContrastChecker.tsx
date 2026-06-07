import { useMemo, useState } from 'react';
import { Box, Chip, Grid, Stack, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

function parseHex(hex: string): [number, number, number] | null {
  let h = hex.trim().replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return null;
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as [number, number, number];
}

function luminance([r, g, b]: [number, number, number]): number {
  const a = [r, g, b].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

function ratio(fg: string, bg: string): number | null {
  const f = parseHex(fg);
  const b = parseHex(bg);
  if (!f || !b) return null;
  const l1 = luminance(f);
  const l2 = luminance(b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

function Verdict({ pass, label }: { pass: boolean; label: string }) {
  const { t } = useTranslation();
  return (
    <Chip
      color={pass ? 'success' : 'error'}
      label={`${label}: ${pass ? t('tools.contrast.pass') : t('tools.contrast.fail')}`}
      aria-label={`${label} ${pass ? t('tools.contrast.pass') : t('tools.contrast.fail')}`}
    />
  );
}

export default function ContrastChecker() {
  const { t } = useTranslation();
  const [fg, setFg] = useState('#14181f');
  const [bg, setBg] = useState('#ffffff');

  const r = useMemo(() => ratio(fg, bg), [fg, bg]);
  const valid = parseHex(fg) && parseHex(bg);

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Stack direction="row" spacing={2} alignItems="center">
            <input
              type="color"
              value={parseHex(fg) ? (fg.startsWith('#') ? fg : `#${fg}`) : '#000000'}
              onChange={(e) => setFg(e.target.value)}
              aria-label={t('tools.contrast.foreground')}
              style={{ width: 48, height: 48, border: 'none', background: 'none', cursor: 'pointer' }}
            />
            <TextField
              label={t('tools.contrast.foreground')}
              value={fg}
              onChange={(e) => setFg(e.target.value)}
              fullWidth
              inputProps={{ style: { fontFamily: 'ui-monospace, monospace' } }}
            />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack direction="row" spacing={2} alignItems="center">
            <input
              type="color"
              value={parseHex(bg) ? (bg.startsWith('#') ? bg : `#${bg}`) : '#ffffff'}
              onChange={(e) => setBg(e.target.value)}
              aria-label={t('tools.contrast.background')}
              style={{ width: 48, height: 48, border: 'none', background: 'none', cursor: 'pointer' }}
            />
            <TextField
              label={t('tools.contrast.background')}
              value={bg}
              onChange={(e) => setBg(e.target.value)}
              fullWidth
              inputProps={{ style: { fontFamily: 'ui-monospace, monospace' } }}
            />
          </Stack>
        </Grid>
      </Grid>

      {valid && r && (
        <Box role="region" aria-label={t('common.result')} tabIndex={0} sx={{ mt: 3, outline: 'none' }} aria-live="polite">
          <Box
            sx={{
              p: 3,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              color: fg,
              backgroundColor: bg,
              mb: 2,
            }}
          >
            <Typography sx={{ color: fg, fontSize: '1.5rem', fontWeight: 700 }}>Aa Bb Cc 123</Typography>
            <Typography sx={{ color: fg }}>The quick brown fox — A rápida raposa marrom</Typography>
          </Box>
          <Typography component="h3" variant="h3">
            {t('tools.contrast.ratio')}: {r.toFixed(2)}:1
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
            <Verdict pass={r >= 4.5} label={`AA ${t('tools.contrast.normalText')}`} />
            <Verdict pass={r >= 7} label={`AAA ${t('tools.contrast.normalText')}`} />
            <Verdict pass={r >= 3} label={`AA ${t('tools.contrast.largeText')}`} />
            <Verdict pass={r >= 4.5} label={`AAA ${t('tools.contrast.largeText')}`} />
          </Stack>
        </Box>
      )}
    </Box>
  );
}
