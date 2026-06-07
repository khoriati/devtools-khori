import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useTranslation } from 'react-i18next';
import OutputBlock from '../components/OutputBlock';
import CopyButton from '../components/CopyButton';
import { useSettings } from '../context/SettingsContext';

// How to run the same command locally, per OS. `install` is shown only when the
// tool is not shipped with the OS by default.
type LocalCmd = { os: string; cmd: string; install?: string };
const LOCAL_RUN: Record<string, LocalCmd[]> = {
  ping: [
    { os: 'Windows', cmd: 'ping HOST' },
    { os: 'macOS', cmd: 'ping -c 4 HOST' },
    { os: 'Linux', cmd: 'ping -c 4 HOST' },
  ],
  traceroute: [
    { os: 'Windows', cmd: 'tracert HOST' },
    { os: 'macOS', cmd: 'traceroute HOST' },
    { os: 'Linux', cmd: 'traceroute HOST', install: 'sudo apt-get install -y traceroute' },
  ],
  whois: [
    { os: 'Windows', cmd: 'whois HOST', install: 'winget install -e --id Microsoft.Sysinternals.Whois' },
    { os: 'macOS', cmd: 'whois HOST' },
    { os: 'Linux', cmd: 'whois HOST', install: 'sudo apt-get install -y whois' },
  ],
};

type ApiResult = { ok: boolean; output?: string; error?: string };

const HOST_RE = /^(?![-:])[A-Za-z0-9.\-:]{1,253}$/;

const DNS_TYPES = ['A', 'AAAA', 'MX', 'TXT', 'NS', 'CNAME', 'SOA', 'CAA'];

export default function NetworkTool({ endpoint, withDnsType = false }: { endpoint: string; withDnsType?: boolean }) {
  const { t } = useTranslation();
  const { announce } = useSettings();
  const [host, setHost] = useState('');
  const [type, setType] = useState('A');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const invalid = host.length > 0 && !HOST_RE.test(host);

  const run = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!HOST_RE.test(host)) {
      setError(t('common.invalidHost'));
      announce(t('common.invalidHost'));
      return;
    }
    setLoading(true);
    setError('');
    setOutput('');
    announce(t('common.loading'));
    try {
      const params = new URLSearchParams({ host });
      if (withDnsType) params.set('type', type);
      const res = await fetch(`/api/${endpoint}?${params.toString()}`);
      const data: ApiResult = await res.json();
      if (data.ok && data.output) {
        setOutput(data.output);
        announce(t('common.result'));
      } else {
        const msg = data.error === 'invalid_host' ? t('common.invalidHost') : data.output || t('common.error');
        setError(msg);
        announce(t('common.error'));
      }
    } catch {
      setError(t('common.error'));
      announce(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <form onSubmit={run} noValidate>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="flex-start">
          <TextField
            label={t('common.host')}
            value={host}
            onChange={(e) => setHost(e.target.value.trim())}
            error={invalid}
            helperText={invalid ? t('common.invalidHost') : t('common.networkNote')}
            fullWidth
            autoComplete="off"
            inputProps={{ spellCheck: false, 'aria-required': true }}
          />
          {withDnsType && (
            <TextField
              select
              label={t('tools.dns.recordType')}
              value={type}
              onChange={(e) => setType(e.target.value)}
              sx={{ minWidth: 140 }}
            >
              {DNS_TYPES.map((tp) => (
                <MenuItem key={tp} value={tp}>
                  {tp}
                </MenuItem>
              ))}
            </TextField>
          )}
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !host}
            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <PlayArrowIcon />}
            sx={{ minWidth: 140, mt: { sm: 0.5 } }}
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

      <OutputBlock value={output} />

      {LOCAL_RUN[endpoint] && (
        <Box component="section" aria-labelledby={`localrun-${endpoint}`} sx={{ mt: 3 }}>
          <Divider sx={{ mb: 2 }} />
          <Typography id={`localrun-${endpoint}`} component="h3" variant="h3" gutterBottom>
            {t('localrun.title')}
          </Typography>
          <Stack spacing={1.5}>
            {LOCAL_RUN[endpoint].map((row) => {
              const cmd = row.cmd.replace('HOST', host || 'exemplo.com');
              return (
                <Box key={row.os}>
                  <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                    <Typography component="span" sx={{ fontWeight: 700, minWidth: 88 }}>
                      {row.os}
                    </Typography>
                    <Box
                      component="code"
                      sx={{
                        fontFamily: 'ui-monospace, monospace',
                        bgcolor: 'action.hover',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                      }}
                    >
                      {cmd}
                    </Box>
                    <CopyButton value={cmd} />
                    {!row.install && (
                      <Typography component="span" variant="body2" color="text.secondary">
                        {t('localrun.builtin')}
                      </Typography>
                    )}
                  </Stack>
                  {row.install && (
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5, ml: { sm: 11 } }} flexWrap="wrap" useFlexGap>
                      <Typography component="span" variant="body2" color="text.secondary">
                        {t('localrun.install')}
                      </Typography>
                      <Box
                        component="code"
                        sx={{ fontFamily: 'ui-monospace, monospace', bgcolor: 'action.hover', px: 1, py: 0.5, borderRadius: 1 }}
                      >
                        {row.install}
                      </Box>
                      <CopyButton value={row.install} />
                    </Stack>
                  )}
                </Box>
              );
            })}
          </Stack>
        </Box>
      )}
    </Box>
  );
}
