import { useState } from 'react';
import { Alert, Box, Grid, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

type Base = { key: string; radix: number; pattern: RegExp };

const BASES: Base[] = [
  { key: 'decimal', radix: 10, pattern: /^[0-9]+$/ },
  { key: 'hex', radix: 16, pattern: /^[0-9a-fA-F]+$/ },
  { key: 'octal', radix: 8, pattern: /^[0-7]+$/ },
  { key: 'binary', radix: 2, pattern: /^[01]+$/ },
];

const WIDTHS = [8, 16, 32, 64];

export default function BaseConverter() {
  const { t } = useTranslation();
  const [value, setValue] = useState<bigint | null>(0n);
  const [raw, setRaw] = useState<Record<string, string>>({ decimal: '0', hex: '0', octal: '0', binary: '0' });
  const [error, setError] = useState('');
  const [width, setWidth] = useState(32);

  const update = (baseKey: string, input: string) => {
    const base = BASES.find((b) => b.key === baseKey)!;
    const trimmed = input.trim();
    if (trimmed === '') {
      setValue(null);
      setError('');
      setRaw((r) => ({ ...r, [baseKey]: '' }));
      return;
    }
    if (!base.pattern.test(trimmed)) {
      setError(t('tools.base-converter.invalid'));
      setRaw((r) => ({ ...r, [baseKey]: input }));
      return;
    }
    try {
      const n = [...trimmed].reduce((acc, ch) => acc * BigInt(base.radix) + BigInt(parseInt(ch, base.radix)), 0n);
      setValue(n);
      setError('');
      setRaw({
        decimal: n.toString(10),
        hex: n.toString(16).toUpperCase(),
        octal: n.toString(8),
        binary: n.toString(2),
      });
    } catch {
      setError(t('tools.base-converter.invalid'));
    }
  };

  const grouped = (s: string, size: number) => {
    const out: string[] = [];
    for (let i = s.length; i > 0; i -= size) out.unshift(s.slice(Math.max(0, i - size), i));
    return out.join(' ');
  };

  const masked = value !== null ? value & ((1n << BigInt(width)) - 1n) : 0n;

  return (
    <Box>
      <Grid container spacing={2}>
        {BASES.map((b) => (
          <Grid item xs={12} sm={6} key={b.key}>
            <TextField
              label={t(`tools.base-converter.${b.key}`)}
              value={raw[b.key]}
              onChange={(e) => update(b.key, e.target.value)}
              fullWidth
              autoComplete="off"
              inputProps={{ spellCheck: false, style: { fontFamily: 'ui-monospace, monospace' } }}
            />
          </Grid>
        ))}
      </Grid>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }} role="alert">
          {error}
        </Alert>
      )}

      <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 3 }}>
        <TextField
          select
          label={t('tools.base-converter.bits')}
          value={width}
          onChange={(e) => setWidth(Number(e.target.value))}
          sx={{ minWidth: 140 }}
        >
          {WIDTHS.map((w) => (
            <MenuItem key={w} value={w}>
              {w}-bit
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      {value !== null && (
        <Box sx={{ mt: 2 }} aria-live="polite">
          <Typography component="h3" variant="h3" gutterBottom>
            {width}-bit
          </Typography>
          <Typography sx={{ fontFamily: 'ui-monospace, monospace', wordBreak: 'break-all' }}>
            {grouped(masked.toString(2).padStart(width, '0'), 4)}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
