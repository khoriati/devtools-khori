import { useEffect, useRef } from 'react';
import { Box, Breadcrumbs, Link as MuiLink, Typography } from '@mui/material';
import { Link, useParams, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getTool } from '../tools/registry';
import { useSettings } from '../context/SettingsContext';

export default function ToolView() {
  const { id } = useParams();
  const { t } = useTranslation();
  const { announce } = useSettings();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const tool = getTool(id);

  useEffect(() => {
    if (tool) {
      document.title = `${t(`tools.${tool.id}.name`)} — ${t('app.title')}`;
      // Move focus to the heading so activating a tool with Enter "enters" it,
      // and announce the new page to screen readers.
      headingRef.current?.focus();
      announce(t(`tools.${tool.id}.name`));
    }
  }, [tool, t, announce]);

  // Shift-Tab from the heading returns focus to the activated sidebar item
  // (the current page link) instead of walking back to the last menu item.
  const handleHeadingKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab' && e.shiftKey) {
      const current = document.querySelector<HTMLElement>('nav a[aria-current="page"]');
      if (current) {
        e.preventDefault();
        current.focus();
      }
    }
  };

  if (!tool) return <Navigate to="/" replace />;

  return (
    <Box>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 1 }}>
        <MuiLink component={Link} to="/">
          {t('nav.home')}
        </MuiLink>
        <Typography color="text.primary">{t(`tools.${tool.id}.name`)}</Typography>
      </Breadcrumbs>

      <Typography
        component="h1"
        variant="h1"
        tabIndex={-1}
        ref={headingRef}
        onKeyDown={handleHeadingKeyDown}
        sx={{ outline: 'none' }}
      >
        {t(`tools.${tool.id}.name`)}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 760, mb: 3 }}>
        {t(`tools.${tool.id}.desc`)}
      </Typography>

      {tool.render()}
    </Box>
  );
}
