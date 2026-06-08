import { useEffect, useRef } from 'react';
import { Alert, Box, Card, CardActionArea, CardContent, Grid, Stack, Typography } from '@mui/material';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import { Link, useNavigationType } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TOOLS, toolSearchText } from '../tools/registry';
import { useSettings } from '../context/SettingsContext';

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const { query } = useSettings();
  const navType = useNavigationType();
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    document.title = `${t('app.title')} — ${t('app.tagline')}`;
    // When the user navigates here (e.g. activates "Home"), move focus into the
    // content heading so they land on "Choose a tool" and can Tab through the
    // cards. Only on real navigation (PUSH) — not on first load, where the skip
    // link must remain the first focusable element. Defer to the next frame so
    // the browser doesn't restore focus elsewhere after the route commit (Safari).
    if (navType !== 'PUSH') return;
    const raf = requestAnimationFrame(() => headingRef.current?.focus());
    return () => cancelAnimationFrame(raf);
  }, [t, navType]);

  const q = query.trim().toLowerCase();
  const tools = TOOLS.filter((tool) => !q || toolSearchText(tool, i18n.language, t).includes(q));

  return (
    <Box>
      <Typography
        component="h1"
        variant="h1"
        tabIndex={-1}
        ref={headingRef}
        gutterBottom
        // Explicit :focus ring (not only :focus-visible): when we move focus here
        // programmatically on navigation, the indicator must be visible in every
        // browser (Safari doesn't trigger :focus-visible for programmatic focus).
        sx={(theme) => ({
          borderRadius: '4px',
          '&:focus': { outline: `3px solid ${theme.palette.primary.main}`, outlineOffset: '4px' },
        })}
      >
        {t('home.heading')}
      </Typography>
      <Typography variant="body1" sx={{ maxWidth: '70ch', mb: 3 }}>
        {t('home.intro')}
      </Typography>

      <Card variant="outlined" sx={{ mb: 4, bgcolor: 'background.paper' }}>
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <AccessibilityNewIcon color="primary" fontSize="large" aria-hidden="true" />
            <Box>
              <Typography component="h2" variant="h2" gutterBottom>
                {t('home.a11yHeading')}
              </Typography>
              <Typography variant="body1">{t('home.a11yText')}</Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {q && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }} role="status" aria-live="polite">
          {t('nav.searchResults', { count: tools.length })}
        </Typography>
      )}

      {q && tools.length === 0 && (
        <Alert severity="info" role="status">
          {t('nav.noResults', { query })}
        </Alert>
      )}

      <Grid container spacing={2} component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Grid item xs={12} sm={6} md={4} key={tool.id} component="li">
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardActionArea component={Link} to={`/tool/${tool.id}`} sx={{ height: '100%', p: 1 }}>
                  <CardContent>
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                      <Icon color="primary" aria-hidden="true" />
                      <Typography component="h3" variant="h3">
                        {t(`tools.${tool.id}.name`)}
                      </Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      {t(`tools.${tool.id}.desc`)}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
