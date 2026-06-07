import { useMemo } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useSettings } from './context/SettingsContext';
import { buildTheme } from './theme';
import Layout from './components/Layout';
import HomePage from './components/HomePage';
import ToolView from './components/ToolView';
import VLibrasWidget from './components/VLibrasWidget';

export default function App() {
  const { mode } = useSettings();
  const theme = useMemo(() => buildTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="tool/:id" element={<ToolView />} />
            <Route path="*" element={<HomePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      {/* Libras (Brazilian Sign Language) — only rendered when the language is pt-BR. */}
      <VLibrasWidget />
    </ThemeProvider>
  );
}
