import { Box, Paper, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import CopyButton from './CopyButton';

type Props = {
  label?: string;
  value: string;
  /** When true, render as a focusable, scrollable region with a programmatic name. */
  monospace?: boolean;
  children?: ReactNode;
  copyable?: boolean;
};

/** A labelled, screen-reader-announceable region for command/tool output. */
export default function OutputBlock({ label, value, monospace = true, children, copyable = true }: Props) {
  const { t } = useTranslation();
  const heading = label ?? t('common.result');
  return (
    <Box component="section" aria-label={heading} sx={{ mt: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
        <Typography component="h3" variant="h3">
          {heading}
        </Typography>
        {copyable && value ? <CopyButton value={value} /> : null}
      </Stack>
      <Paper
        variant="outlined"
        tabIndex={0}
        role="region"
        aria-label={heading}
        sx={{
          p: 2,
          maxHeight: 420,
          overflow: 'auto',
          fontFamily: monospace ? 'ui-monospace, SFMono-Regular, Menlo, monospace' : undefined,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          fontSize: '0.95rem',
        }}
      >
        {children ?? (value || <Typography color="text.secondary">{t('common.empty')}</Typography>)}
      </Paper>
    </Box>
  );
}
