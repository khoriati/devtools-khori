import { useState } from 'react';
import { Box, Button, Stack, TextField } from '@mui/material';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { useTranslation } from 'react-i18next';
import OutputBlock from '../components/OutputBlock';
import { useSettings } from '../context/SettingsContext';

export default function UuidTool() {
  const { t } = useTranslation();
  const { announce } = useSettings();
  const [quantity, setQuantity] = useState(5);
  const [output, setOutput] = useState('');

  const generate = () => {
    const n = Math.max(1, Math.min(100, quantity));
    const list = Array.from({ length: n }, () => crypto.randomUUID());
    setOutput(list.join('\n'));
    announce(t('common.result'));
  };

  return (
    <Box>
      <Stack direction="row" spacing={2} alignItems="center">
        <TextField
          type="number"
          label={t('tools.uuid.quantity')}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          inputProps={{ min: 1, max: 100, 'aria-label': t('tools.uuid.quantity') }}
          sx={{ width: 140 }}
        />
        <Button variant="contained" onClick={generate} startIcon={<AutorenewIcon />}>
          {t('tools.uuid.generate')}
        </Button>
      </Stack>
      <OutputBlock value={output} monospace />
    </Box>
  );
}
