import { useEffect, useState } from 'react';
import { Box, MenuItem, Stack, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import OutputBlock from '../components/OutputBlock';

const ALGOS = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'];

async function digest(algo: string, text: string): Promise<string> {
  const buf = await crypto.subtle.digest(algo, new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export default function HashTool() {
  const { t } = useTranslation();
  const [algo, setAlgo] = useState('SHA-256');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  useEffect(() => {
    let active = true;
    if (!input) {
      setOutput('');
      return;
    }
    digest(algo, input).then((h) => {
      if (active) setOutput(h);
    });
    return () => {
      active = false;
    };
  }, [algo, input]);

  return (
    <Box>
      <Stack spacing={2}>
        <TextField
          select
          label={t('tools.hash.algorithm')}
          value={algo}
          onChange={(e) => setAlgo(e.target.value)}
          sx={{ maxWidth: 200 }}
        >
          {ALGOS.map((a) => (
            <MenuItem key={a} value={a}>
              {a}
            </MenuItem>
          ))}
        </TextField>
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
      <OutputBlock label={algo} value={output} monospace />
    </Box>
  );
}
