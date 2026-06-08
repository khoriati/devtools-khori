import { useMemo, useState } from 'react';
import { Box, InputAdornment, TextField, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from 'react-i18next';
import { GLOSSARY, type Lang } from './glossaryData';

export default function Glossary() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as Lang;
  const [filter, setFilter] = useState('');

  const entries = useMemo(() => {
    const q = filter.trim().toLowerCase();
    return GLOSSARY.map((e) => ({ term: e.term, def: e.d[lang] ?? e.d['en-US'] ?? e.d['pt-BR'] }))
      .filter((e) => !q || e.term.toLowerCase().includes(q) || e.def.toLowerCase().includes(q))
      .sort((a, b) => a.term.localeCompare(b.term, lang));
  }, [filter, lang]);

  return (
    <Box>
      <TextField
        label={t('cheats.filter')}
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        type="search"
        fullWidth
        autoComplete="off"
        sx={{ maxWidth: 460, mb: 1 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon aria-hidden="true" />
            </InputAdornment>
          ),
        }}
        inputProps={{ 'aria-describedby': 'glossary-count' }}
      />
      <Typography id="glossary-count" variant="body2" color="text.secondary" aria-live="polite" sx={{ mb: 2 }}>
        {t('cheats.results', { count: entries.length })}
      </Typography>

      {/* A description list (<dl>) is the semantic structure for a glossary. */}
      <Box component="dl" sx={{ m: 0 }}>
        {entries.map((e) => (
          <Box key={e.term} sx={{ mb: 2 }}>
            <Typography component="dt" sx={{ fontWeight: 700 }}>
              {e.term}
            </Typography>
            <Typography component="dd" sx={{ m: 0, maxWidth: '72ch', color: 'text.secondary' }}>
              {e.def}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
