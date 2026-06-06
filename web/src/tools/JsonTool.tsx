import { useState } from 'react';
import { Alert, Box, Button, Stack, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import OutputBlock from '../components/OutputBlock';
import { useSettings } from '../context/SettingsContext';

export default function JsonTool() {
  const { t } = useTranslation();
  const { announce } = useSettings();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const transform = (minify: boolean) => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, minify ? 0 : 2));
      setError('');
      announce(t('tools.json.valid'));
    } catch (e) {
      setError(`${t('tools.json.invalid')}: ${(e as Error).message}`);
      setOutput('');
      announce(t('tools.json.invalid'));
    }
  };

  return (
    <Box>
      <TextField
        label={t('common.input')}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        fullWidth
        multiline
        minRows={5}
        autoComplete="off"
        inputProps={{ spellCheck: false, style: { fontFamily: 'ui-monospace, monospace' } }}
      />
      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        <Button variant="contained" onClick={() => transform(false)} disabled={!input}>
          {t('tools.json.format')}
        </Button>
        <Button variant="outlined" onClick={() => transform(true)} disabled={!input}>
          {t('tools.json.minify')}
        </Button>
      </Stack>
      {error && (
        <Alert severity="error" sx={{ mt: 2 }} role="alert">
          {error}
        </Alert>
      )}
      <OutputBlock value={output} monospace />
    </Box>
  );
}
