import { useState } from 'react';
import { Alert, Box, Button, Chip, CircularProgress, MenuItem, Stack, TextField, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useTranslation } from 'react-i18next';
import OutputBlock from '../components/OutputBlock';
import { useSettings } from '../context/SettingsContext';

type HttpResult = {
  ok: boolean;
  status?: number;
  statusText?: string;
  url?: string;
  elapsedMs?: number;
  headers?: Record<string, string>;
  body?: string;
  error?: string;
};

const METHODS = ['GET', 'HEAD', 'OPTIONS'];

export default function HttpInspector() {
  const { t } = useTranslation();
  const { announce } = useSettings();
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState('GET');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<HttpResult | null>(null);
  const [error, setError] = useState('');

  const run = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    announce(t('common.loading'));
    try {
      const res = await fetch('/api/http', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, method }),
      });
      const data: HttpResult = await res.json();
      if (data.ok) {
        setResult(data);
        announce(`${t('tools.http.status')} ${data.status}`);
      } else {
        setError(data.error || t('common.error'));
        announce(t('common.error'));
      }
    } catch {
      setError(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  const headerText = result?.headers
    ? Object.entries(result.headers)
        .map(([k, v]) => `${k}: ${v}`)
        .join('\n')
    : '';

  return (
    <Box>
      <form onSubmit={run} noValidate>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="flex-start">
          <TextField
            select
            label={t('tools.http.method')}
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            sx={{ minWidth: 130 }}
          >
            {METHODS.map((m) => (
              <MenuItem key={m} value={m}>
                {m}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label={t('common.url')}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            fullWidth
            type="url"
            autoComplete="off"
            inputProps={{ spellCheck: false, 'aria-required': true }}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !url}
            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <SendIcon />}
            sx={{ minWidth: 130, mt: { sm: 0.5 } }}
          >
            {t('common.run')}
          </Button>
        </Stack>
      </form>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }} role="alert">
          {error}
        </Alert>
      )}

      {result && (
        <Stack spacing={1} sx={{ mt: 2 }}>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap alignItems="center">
            <Chip
              color={result.status && result.status < 400 ? 'success' : 'error'}
              label={`${t('tools.http.status')}: ${result.status} ${result.statusText ?? ''}`}
            />
            <Chip variant="outlined" label={`${t('tools.http.time')}: ${result.elapsedMs} ms`} />
            <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
              {result.url}
            </Typography>
          </Stack>
          <OutputBlock label={t('tools.http.headers')} value={headerText} />
          {result.body ? <OutputBlock label={t('tools.http.body')} value={result.body} /> : null}
        </Stack>
      )}
    </Box>
  );
}
