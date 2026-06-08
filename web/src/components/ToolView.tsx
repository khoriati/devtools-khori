import { useEffect, useRef } from 'react';
import { Box, Breadcrumbs, Link as MuiLink, Typography } from '@mui/material';
import { Link, useParams, Navigate, useNavigationType } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getTool } from '../tools/registry';
import { useSettings } from '../context/SettingsContext';

export default function ToolView() {
  const { id } = useParams();
  const { t } = useTranslation();
  const { announce } = useSettings();
  const navType = useNavigationType();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const tool = getTool(id);

  useEffect(() => {
    if (tool) {
      document.title = `${t(`tools.${tool.id}.name`)} — ${t('app.title')}`;
      // On real navigation (PUSH), move focus to the heading so activating a tool
      // with Enter "enters" it; announce the new page to screen readers. Skip on
      // first load (POP) so the skip link stays the first focusable element.
      if (navType === 'PUSH') headingRef.current?.focus();
      announce(t(`tools.${tool.id}.name`));
    }
  }, [tool, t, announce, navType]);

  if (!tool) return <Navigate to="/" replace />;

  return (
    <Box>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 1 }}>
        <MuiLink component={Link} to="/">
          {t('nav.home')}
        </MuiLink>
        <Typography color="text.primary">{t(`tools.${tool.id}.name`)}</Typography>
      </Breadcrumbs>

      <Typography component="h1" variant="h1" tabIndex={-1} ref={headingRef} sx={{ outline: 'none' }}>
        {t(`tools.${tool.id}.name`)}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 760, mb: 3 }}>
        {t(`tools.${tool.id}.desc`)}
      </Typography>

      {tool.render()}
    </Box>
  );
}
