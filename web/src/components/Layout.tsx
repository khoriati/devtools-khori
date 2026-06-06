import { useState } from 'react';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  Link as MuiLink,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  InputAdornment,
  TextField,
  Toolbar,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import GitHubIcon from '@mui/icons-material/GitHub';
import SearchIcon from '@mui/icons-material/Search';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Logo from './Logo';
import SettingsMenu from './SettingsMenu';
import { TOOLS, TOOL_GROUPS, toolSearchText } from '../tools/registry';
import { useSettings } from '../context/SettingsContext';

const DRAWER_WIDTH = 280;
const GITHUB_URL = 'https://github.com/khoriati/devtools-khori';

const skipLinkSx = {
  position: 'absolute',
  left: 8,
  top: -64,
  zIndex: (t: { zIndex: { tooltip: number } }) => t.zIndex.tooltip + 1,
  bgcolor: 'primary.main',
  color: 'primary.contrastText',
  px: 2,
  py: 1,
  borderRadius: 1,
  fontWeight: 700,
  '&:focus': { top: 8 },
} as const;

export default function Layout() {
  const { t, i18n } = useTranslation();
  const { query, setQuery } = useSettings();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const q = query.trim().toLowerCase();
  const matches = (toolId: string) => {
    const tool = TOOLS.find((x) => x.id === toolId)!;
    return !q || toolSearchText(tool, i18n.language, t).includes(q);
  };

  const search = (
    <Box role="search" sx={{ px: 2, pt: 2, pb: 1 }}>
      <TextField
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        label={t('nav.search')}
        type="search"
        size="small"
        fullWidth
        autoComplete="off"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon aria-hidden="true" />
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );

  const nav = (
    <nav aria-label={t('nav.label')}>
      <List>
        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            to="/"
            selected={location.pathname === '/'}
            onClick={() => setMobileOpen(false)}
          >
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary={t('nav.home')} />
          </ListItemButton>
        </ListItem>
      </List>
      {TOOL_GROUPS.map((group) => {
        const groupTools = TOOLS.filter((tool) => tool.group === group && matches(tool.id));
        if (groupTools.length === 0) return null;
        return (
        <List
          key={group}
          subheader={
            <ListSubheader disableSticky id={`group-${group}`}>
              {t(`nav.groups.${group}`)}
            </ListSubheader>
          }
          aria-labelledby={`group-${group}`}
        >
          {groupTools.map((tool) => {
            const Icon = tool.icon;
            const to = `/tool/${tool.id}`;
            return (
              <ListItem key={tool.id} disablePadding>
                <ListItemButton
                  component={Link}
                  to={to}
                  selected={location.pathname === to}
                  onClick={() => setMobileOpen(false)}
                  aria-current={location.pathname === to ? 'page' : undefined}
                >
                  <ListItemIcon>
                    <Icon />
                  </ListItemIcon>
                  <ListItemText primary={t(`tools.${tool.id}.name`)} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
        );
      })}
    </nav>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <MuiLink href="#main-content" sx={skipLinkSx}>
        {t('app.skipToContent')}
      </MuiLink>

      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }} component="header">
        <Toolbar>
          {!isDesktop && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label={t('nav.label')}
              aria-expanded={mobileOpen}
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <MuiLink component={Link} to="/" color="inherit" underline="none" sx={{ display: 'flex', flexGrow: 1 }}>
            <Logo />
          </MuiLink>
          <SettingsMenu />
          <IconButton
            color="inherit"
            component="a"
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('app.githubLabel')}
            size="large"
          >
            <GitHubIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box component="aside" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }} aria-label={t('nav.label')}>
        <Drawer
          variant={isDesktop ? 'permanent' : 'temporary'}
          open={isDesktop || mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: 'auto' }}>
            {search}
            {nav}
          </Box>
        </Drawer>
      </Box>

      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', width: { md: `calc(100% - ${DRAWER_WIDTH}px)` } }}>
        <Toolbar />
        <Box component="main" id="main-content" tabIndex={-1} sx={{ p: { xs: 2, sm: 3 }, flexGrow: 1, outline: 'none' }}>
          <Outlet />
        </Box>
        <Box component="footer" sx={{ p: 2, textAlign: 'center', borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="body2" color="text.secondary">
            {t('app.footer')}{' '}
            <MuiLink href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
              GitHub
            </MuiLink>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
