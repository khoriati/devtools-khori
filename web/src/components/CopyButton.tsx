import { useState } from 'react';
import { Button, IconButton, Tooltip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../context/SettingsContext';

export default function CopyButton({
  value,
  size = 'small',
  iconOnly = false,
}: {
  value: string;
  size?: 'small' | 'medium';
  // iconOnly: compact, icon-only variant for tight spots (e.g. table columns).
  iconOnly?: boolean;
}) {
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

  const label = done ? t('common.copied') : t('common.copy');
  const icon = done ? <CheckIcon /> : <ContentCopyIcon />;

  if (iconOnly) {
    return (
      <Tooltip title={label}>
        <span>
          <IconButton onClick={copy} size={size} disabled={!value} aria-label={label} color="primary">
            {icon}
          </IconButton>
        </span>
      </Tooltip>
    );
  }

  return (
    <Tooltip title={t('common.copy')}>
      <span>
        <Button onClick={copy} size={size} variant="outlined" disabled={!value} startIcon={icon} aria-label={label}>
          {label}
        </Button>
      </span>
    </Tooltip>
  );
}
