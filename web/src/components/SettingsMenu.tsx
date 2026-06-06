import { useState } from 'react';
import {
  Divider,
  IconButton,
  ListSubheader,
  Menu,
  MenuItem,
  Radio,
  Tooltip,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import ContrastIcon from '@mui/icons-material/Contrast';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../context/SettingsContext';
import { THEME_MODES, type ThemeMode } from '../theme';
import { SUPPORTED_LANGUAGES } from '../i18n';

const MODE_ICON: Record<ThemeMode, JSX.Element> = {
  light: <LightModeIcon fontSize="small" />,
  dark: <DarkModeIcon fontSize="small" />,
  'high-contrast': <ContrastIcon fontSize="small" />,
};

export default function SettingsMenu() {
  const { t } = useTranslation();
  const { mode, setMode, language, setLanguage, announce } = useSettings();
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);
  const open = Boolean(anchor);

  return (
    <>
      <Tooltip title={t('settings.openSettings')}>
        <IconButton
          onClick={(e) => setAnchor(e.currentTarget)}
          aria-label={t('settings.openSettings')}
          aria-haspopup="menu"
          aria-expanded={open}
          color="inherit"
          size="large"
        >
          <SettingsIcon />
        </IconButton>
      </Tooltip>
      <Menu anchorEl={anchor} open={open} onClose={() => setAnchor(null)}>
        <ListSubheader disableSticky>{t('settings.theme')}</ListSubheader>
        {THEME_MODES.map((m) => (
          <MenuItem
            key={m}
            selected={mode === m}
            onClick={() => {
              setMode(m);
              announce(`${t('settings.theme')}: ${t(`settings.themeMode.${m}`)}`);
            }}
          >
            <Radio checked={mode === m} tabIndex={-1} size="small" sx={{ mr: 1 }} />
            {MODE_ICON[m]}
            <span style={{ marginLeft: 8 }}>{t(`settings.themeMode.${m}`)}</span>
          </MenuItem>
        ))}
        <Divider />
        <ListSubheader disableSticky>{t('settings.language')}</ListSubheader>
        {SUPPORTED_LANGUAGES.map((lng) => (
          <MenuItem
            key={lng}
            selected={language === lng}
            lang={lng}
            onClick={() => {
              setLanguage(lng);
              announce(t('settings.languageNames.' + lng));
            }}
          >
            <Radio checked={language === lng} tabIndex={-1} size="small" sx={{ mr: 1 }} />
            {t(`settings.languageNames.${lng}`)}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
