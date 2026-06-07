import { useMemo, useState } from 'react';
import {
  Box,
  InputAdornment,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from 'react-i18next';
import CopyButton from '../components/CopyButton';
import { CMD_SECTIONS, type Lang } from './cmdCompareData';

const localized = (rec: Record<Lang, string>, lang: string) =>
  rec[lang as Lang] ?? rec['en-US'] ?? rec['pt-BR'];

// A monospace command cell with a compact copy button.
function Cmd({ value }: { value: string }) {
  return (
    <Stack direction="row" spacing={0.5} alignItems="flex-start">
      <Box
        component="code"
        sx={{
          flex: 1,
          fontFamily: 'ui-monospace, monospace',
          fontSize: '0.9rem',
          bgcolor: 'action.hover',
          px: 1,
          py: 0.5,
          borderRadius: 1,
          wordBreak: 'break-word',
        }}
      >
        {value}
      </Box>
      <CopyButton value={value} iconOnly />
    </Stack>
  );
}

export default function CmdCompare() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [filter, setFilter] = useState('');

  const sections = useMemo(() => {
    const q = filter.trim().toLowerCase();
    return CMD_SECTIONS.map((s) => ({
      title: localized(s.title, lang),
      items: s.items
        .map((it) => ({ sh: it.sh, ps: it.ps, desc: localized(it.d, lang) }))
        .filter((it) => !q || it.sh.toLowerCase().includes(q) || it.ps.toLowerCase().includes(q) || it.desc.toLowerCase().includes(q)),
    })).filter((s) => s.items.length > 0);
  }, [filter, lang]);

  const count = sections.reduce((n, s) => n + s.items.length, 0);

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
        inputProps={{ 'aria-describedby': 'cmdcompare-count' }}
      />
      <Typography id="cmdcompare-count" variant="body2" color="text.secondary" aria-live="polite" sx={{ mb: 2 }}>
        {t('cheats.results', { count })}
      </Typography>

      <Stack spacing={3}>
        {sections.map((s) => (
          <Box component="section" key={s.title} aria-label={s.title}>
            <Typography component="h3" variant="h3" gutterBottom>
              {s.title}
            </Typography>
            {/* Fixed layout: the two command columns share most of the width,
                the description takes the remainder. */}
            <Table size="small" aria-label={s.title} sx={{ width: '100%', tableLayout: 'fixed' }}>
              <TableHead>
                <TableRow>
                  <TableCell scope="col" sx={{ width: '34%', fontWeight: 700 }}>
                    {t('cmdcompare.linux')}
                  </TableCell>
                  <TableCell scope="col" sx={{ width: '34%', fontWeight: 700 }}>
                    {t('cmdcompare.powershell')}
                  </TableCell>
                  <TableCell scope="col" sx={{ fontWeight: 700 }}>
                    {t('cmdcompare.description')}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {s.items.map((it) => (
                  <TableRow key={it.sh + it.ps}>
                    <TableCell sx={{ verticalAlign: 'top', p: 1 }}>
                      <Cmd value={it.sh} />
                    </TableCell>
                    <TableCell sx={{ verticalAlign: 'top', p: 1 }}>
                      <Cmd value={it.ps} />
                    </TableCell>
                    <TableCell sx={{ verticalAlign: 'top' }}>{it.desc}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
