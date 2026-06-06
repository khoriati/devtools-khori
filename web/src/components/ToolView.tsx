import { useEffect, useRef } from 'react';
import { Box, Breadcrumbs, Link as MuiLink, Typography } from '@mui/material';
import { Link, useParams, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getTool } from '../tools/registry';

export default function ToolView() {
  const { id } = useParams();
  const { t } = useTranslation();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const tool = getTool(id);

  useEffect(() => {
    if (tool) {
      document.title = `${t(`tools.${tool.id}.name`)} — ${t('app.title')}`;
      // Move focus to the heading on navigation so screen-reader users land in context.
      headingRef.current?.focus();
    }
  }, [tool, t]);

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
