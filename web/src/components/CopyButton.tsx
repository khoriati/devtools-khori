import { useState } from 'react';
import { Button, Tooltip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../context/SettingsContext';

export default function CopyButton({ value, size = 'small' }: { value: string; size?: 'small' | 'medium' }) {
  const { t } = useTranslation();
  const { announce } = useSettings();
  const [done, setDone] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setDone(true);
      announce(t('common.copied'));
      window.setTimeout(() => setDone(false), 2000);
    } catch {
      announce(t('common.error'));
    }
  };

  return (
    <Tooltip title={t('common.copy')}>
      <span>
        <Button
          onClick={copy}
          size={size}
          variant="outlined"
          disabled={!value}
          startIcon={done ? <CheckIcon /> : <ContentCopyIcon />}
          aria-label={done ? t('common.copied') : t('common.copy')}
        >
          {done ? t('common.copied') : t('common.copy')}
        </Button>
      </span>
    </Tooltip>
  );
}
