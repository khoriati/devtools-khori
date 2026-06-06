import { useState } from 'react';
import { Alert, Box, Stack, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useTranslation } from 'react-i18next';
import OutputBlock from '../components/OutputBlock';

type Mode = 'encode' | 'decode';

export default function EncoderTool({
  i18nKey,
  encode,
  decode,
}: {
  i18nKey: 'base64' | 'url';
  encode: (s: string) => string;
  decode: (s: string) => string;
}) {
  const { t } = useTranslation();
  const [mode, setMode] = useState<Mode>('encode');
  const [input, setInput] = useState('');

  let output = '';
  let error = '';
  if (input) {
    try {
      output = mode === 'encode' ? encode(input) : decode(input);
    } catch {
      error = t(`tools.${i18nKey}.invalid`);
    }
  }

  return (
    <Box>
      <Stack spacing={2}>
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={(_, v: Mode | null) => v && setMode(v)}
          aria-label={t('common.input')}
          color="primary"
        >
          <ToggleButton value="encode">{t(`tools.${i18nKey}.encode`)}</ToggleButton>
          <ToggleButton value="decode">{t(`tools.${i18nKey}.decode`)}</ToggleButton>
        </ToggleButtonGroup>

        <TextField
          label={t('common.input')}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          fullWidth
          multiline
          minRows={3}
          autoComplete="off"
          inputProps={{ spellCheck: false }}
        />
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }} role="alert">
          {error}
        </Alert>
      )}

      <OutputBlock label={t('common.output')} value={output} monospace />
    </Box>
  );
}

// UTF-8 safe Base64 helpers.
export const base64Encode = (s: string) =>
  btoa(String.fromCharCode(...new TextEncoder().encode(s)));
export const base64Decode = (s: string) =>
  new TextDecoder().decode(Uint8Array.from(atob(s.trim()), (c) => c.charCodeAt(0)));
