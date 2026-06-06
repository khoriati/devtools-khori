import { useMemo, useState } from 'react';
import { Alert, Box, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import OutputBlock from '../components/OutputBlock';

function b64urlDecode(part: string): string {
  const pad = part.length % 4 === 0 ? '' : '='.repeat(4 - (part.length % 4));
  const b64 = part.replace(/-/g, '+').replace(/_/g, '/') + pad;
  const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export default function JwtDecoder() {
  const { t } = useTranslation();
  const [token, setToken] = useState('');

  const decoded = useMemo(() => {
    const value = token.trim();
    if (!value) return null;
    const parts = value.split('.');
    if (parts.length < 2) return { error: true } as const;
    try {
      const header = JSON.stringify(JSON.parse(b64urlDecode(parts[0])), null, 2);
      const payloadObj = JSON.parse(b64urlDecode(parts[1]));
      const payload = JSON.stringify(payloadObj, null, 2);
      const expired = typeof payloadObj.exp === 'number' && payloadObj.exp * 1000 < Date.now();
      return { header, payload, signature: parts[2] ?? '', expired } as const;
    } catch {
      return { error: true } as const;
    }
  }, [token]);

  return (
    <Box>
      <TextField
        label="JWT"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        placeholder={t('tools.jwt.placeholder')}
        fullWidth
        multiline
        minRows={3}
        autoComplete="off"
        inputProps={{ spellCheck: false, style: { fontFamily: 'ui-monospace, monospace' } }}
      />

      {decoded && 'error' in decoded && (
        <Alert severity="error" sx={{ mt: 2 }} role="alert">
          {t('tools.jwt.invalid')}
        </Alert>
      )}

      {decoded && !('error' in decoded) && (
        <Box>
          {decoded.expired && (
            <Alert severity="warning" sx={{ mt: 2 }} role="alert">
              {t('tools.jwt.expWarn')}
            </Alert>
          )}
          <OutputBlock label={t('tools.jwt.header')} value={decoded.header} />
          <OutputBlock label={t('tools.jwt.payload')} value={decoded.payload} />
          {decoded.signature && (
            <OutputBlock label={t('tools.jwt.signature')} value={decoded.signature} copyable={false} />
          )}
        </Box>
      )}
    </Box>
  );
}
