import { useState } from 'react';
import { Box, Button, Grid, Stack, TextField, Typography } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useTranslation } from 'react-i18next';

export default function TimestampTool() {
  const { t, i18n } = useTranslation();
  const [unix, setUnix] = useState<string>(String(Math.floor(Date.now() / 1000)));

  const seconds = Number(unix);
  const valid = unix.trim() !== '' && Number.isFinite(seconds);
  const date = valid ? new Date(seconds * 1000) : null;

  const setNow = () => setUnix(String(Math.floor(Date.now() / 1000)));

  const fmt = (d: Date, utc: boolean) =>
    new Intl.DateTimeFormat(i18n.language, {
      dateStyle: 'full',
      timeStyle: 'long',
      timeZone: utc ? 'UTC' : undefined,
    }).format(d);

  return (
    <Box>
      <Stack direction="row" spacing={2} alignItems="center">
        <TextField
          label={t('tools.timestamp.unix')}
          value={unix}
          onChange={(e) => setUnix(e.target.value.replace(/[^0-9]/g, ''))}
          inputProps={{ inputMode: 'numeric', style: { fontFamily: 'ui-monospace, monospace' } }}
          sx={{ maxWidth: 280 }}
        />
        <Button variant="outlined" onClick={setNow} startIcon={<AccessTimeIcon />}>
          {t('tools.timestamp.now')}
        </Button>
      </Stack>

      {date && (
        <Grid
          container
          spacing={2}
          role="region"
          aria-label={t('common.result')}
          tabIndex={0}
          sx={{ mt: 1, outline: 'none' }}
          aria-live="polite"
        >
          <Grid item xs={12} sm={6}>
            <Typography component="h3" variant="h3">
              {t('tools.timestamp.local')}
            </Typography>
            <Typography>{fmt(date, false)}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography component="h3" variant="h3">
              {t('tools.timestamp.utc')}
            </Typography>
            <Typography>{fmt(date, true)}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography sx={{ fontFamily: 'ui-monospace, monospace' }}>ISO 8601: {date.toISOString()}</Typography>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
