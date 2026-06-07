import { useEffect } from 'react';
import { Box, Breadcrumbs, Link as MuiLink, Typography } from '@mui/material';
import { Link, useParams, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getTool } from '../tools/registry';
import { useSettings } from '../context/SettingsContext';

export default function ToolView() {
  const { id } = useParams();
  const { t } = useTranslation();
  const { announce } = useSettings();
  const tool = getTool(id);

  useEffect(() => {
    if (tool) {
      document.title = `${t(`tools.${tool.id}.name`)} — ${t('app.title')}`;
      // Keep keyboard focus on the activated control (e.g. the sidebar link) so
      // Tab/Shift-Tab continue from where the user was, and announce the new page
      // to screen readers via the polite live region instead of stealing focus.
      announce(t(`tools.${tool.id}.name`));
    }
  }, [tool, t, announce]);

  if (!tool) return <Navigate to="/" replace />;

  return (
    <Box>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 1 }}>
        <MuiLink component={Link} to="/">
          {t('nav.home')}
        </MuiLink>
        <Typography color="text.primary">{t(`tools.${tool.id}.name`)}</Typography>
      </Breadcrumbs>

      <Typography component="h1" variant="h1">
        {t(`tools.${tool.id}.name`)}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 760, mb: 3 }}>
        {t(`tools.${tool.id}.desc`)}
      </Typography>

      {tool.render()}
    </Box>
  );
}
