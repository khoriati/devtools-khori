import { useEffect, useState } from 'react';
import {
  AppBar,
  Box,
  Collapse,
  Drawer,
  IconButton,
  Link as MuiLink,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
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
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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

  // Collapsible (accordion) groups — so users don't tab through every item.
  // The group of the current tool is expanded; others start collapsed (their
  // items are removed from the DOM, so they leave the tab order entirely).
  const activeToolId = location.pathname.startsWith('/tool/')
    ? location.pathname.slice('/tool/'.length)
    : null;
  const activeGroup = activeToolId ? TOOLS.find((x) => x.id === activeToolId)?.group : undefined;

  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('devtools-nav-open') || 'null');
      if (saved && typeof saved === 'object') return saved;
    } catch {
      /* ignore */
    }
    return activeGroup ? { [activeGroup]: true } : {};
  });

  // Keep the active tool's group open when navigating to it.
  useEffect(() => {
    if (activeGroup) setExpanded((e) => (e[activeGroup] ? e : { ...e, [activeGroup]: true }));
  }, [activeGroup]);

  const toggleGroup = (group: string) =>
    setExpanded((e) => {
      const next = { ...e, [group]: !e[group] };
      try {
        localStorage.setItem('devtools-nav-open', JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });

  // While searching, force-open groups that have matches so results are visible.
  const isGroupOpen = (group: string) => (q ? true : Boolean(expanded[group]));

  // Move keyboard focus into the page content heading after a nav item is
  // activated. Crucially this also covers activating an item for the route we
  // are ALREADY on (e.g. pressing Enter on "Início" while on Home): no remount
  // happens, so a route/effect-based focus move never fires. Two animation
  // frames let any new route commit and paint before we focus the <h1>.
  const focusContentHeading = () => {
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        document.querySelector<HTMLElement>('#main-content h1')?.focus();
      }),
    );
  };

  // When the user tabs backwards out of the top of the content (from the tool
  // heading or the first tab stop, i.e. the breadcrumb), return focus to the
  // activated sidebar item instead of walking to the last menu item.
  const returnToActiveNavItem = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key !== 'Tab' || !e.shiftKey) return;
    const main = e.currentTarget;
    const active = document.activeElement;
    const heading = main.querySelector('h1');
    const firstTabbable = main.querySelector<HTMLElement>(
      'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])',
    );
    if (active !== heading && active !== firstTabbable) return;
    const current = document.querySelector<HTMLElement>('nav a[aria-current="page"]');
    if (current && current.offsetParent !== null) {
      e.preventDefault();
      current.focus();
    }
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
            aria-current={location.pathname === '/' ? 'page' : undefined}
            onClick={() => {
              setMobileOpen(false);
              focusContentHeading();
            }}
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
        const open = isGroupOpen(group);
        const headerId = `group-header-${group}`;
        const panelId = `group-panel-${group}`;
        return (
          <Box key={group}>
            {/* Disclosure button: aria-expanded + aria-controls describe the
                collapsible panel; the chevron is decorative (state is in ARIA). */}
            <ListItemButton id={headerId} onClick={() => toggleGroup(group)} aria-expanded={open} aria-controls={panelId}>
              <ListItemText primary={t(`nav.groups.${group}`)} primaryTypographyProps={{ fontWeight: 700 }} />
              {open ? <ExpandLessIcon aria-hidden="true" /> : <ExpandMoreIcon aria-hidden="true" />}
            </ListItemButton>
            {/* unmountOnExit removes collapsed items from the DOM, so they are
                not in the tab order — fewer stops to reach the target. */}
            <Collapse in={open} unmountOnExit>
              <List disablePadding id={panelId} aria-labelledby={headerId}>
                {groupTools.map((tool) => {
                  const Icon = tool.icon;
                  const to = `/tool/${tool.id}`;
                  return (
                    <ListItem key={tool.id} disablePadding>
                      <ListItemButton
                        component={Link}
                        to={to}
                        selected={location.pathname === to}
                        onClick={() => {
                          setMobileOpen(false);
                          focusContentHeading();
                        }}
                        aria-current={location.pathname === to ? 'page' : undefined}
                        sx={{ pl: 4 }}
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
            </Collapse>
          </Box>
        );
      })}

      {/* End-of-menu boundary cue: a focusable, screen-reader-announced marker
          (visible on focus, like a skip link). Tabbing past the last menu item
          lands here ("End of navigation menu"); the next Tab enters the content. */}
      <Box
        tabIndex={0}
        sx={{
          m: 0,
          color: 'text.secondary',
          fontSize: '0.8rem',
          textAlign: 'center',
          height: '1px',
          overflow: 'hidden',
          clip: 'rect(0 0 0 0)',
          whiteSpace: 'nowrap',
          // Reveal on :focus (not :focus-visible): a screen-reader/keyboard focus
          // move must always un-clip and show this cue, regardless of the
          // browser's :focus-visible heuristic.
          '&:focus': { height: 'auto', clip: 'auto', p: 1, whiteSpace: 'normal' },
        }}
      >
        {t('nav.endOfMenu')}
      </Box>
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
        <Box
          component="main"
          id="main-content"
          tabIndex={-1}
          onKeyDown={returnToActiveNavItem}
          sx={{ p: { xs: 2, sm: 3 }, flexGrow: 1, outline: 'none' }}
        >
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
