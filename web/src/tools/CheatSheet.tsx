import { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  InputAdornment,
  Link as MuiLink,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useTranslation } from 'react-i18next';
import CopyButton from '../components/CopyButton';
import { CHEAT_SHEETS, descFor, titleFor } from './cheatsheets';

export default function CheatSheet({ id }: { id: string }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [filter, setFilter] = useState('');
  const sheet = CHEAT_SHEETS[id];

  const sections = useMemo(() => {
    const q = filter.trim().toLowerCase();
    return sheet.sections
      .map((s) => ({
        title: titleFor(s, lang),
        items: s.items
          .map((it) => ({ cmd: it.cmd, desc: descFor(it, lang) }))
          .filter((it) => !q || it.cmd.toLowerCase().includes(q) || it.desc.toLowerCase().includes(q)),
      }))
      .filter((s) => s.items.length > 0);
  }, [sheet, lang, filter]);

  const count = sections.reduce((n, s) => n + s.items.length, 0);

  return (
    <Box>
      {sheet.disclaimerKey && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {t(sheet.disclaimerKey)}
        </Alert>
      )}
      {sheet.links && sheet.links.length > 0 && (
        <Stack
          component="nav"
          aria-label={t('cheats.docs')}
          direction="row"
          spacing={2}
          flexWrap="wrap"
          useFlexGap
          sx={{ mb: 2 }}
        >
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            {t('cheats.docs')}:
          </Typography>
          {sheet.links.map((l) => (
            <MuiLink
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}
            >
              {l.label}
              <OpenInNewIcon fontSize="inherit" aria-hidden="true" />
            </MuiLink>
          ))}
        </Stack>
      )}
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
        inputProps={{ 'aria-describedby': `cheat-count-${id}` }}
      />
      <Typography id={`cheat-count-${id}`} variant="body2" color="text.secondary" aria-live="polite" sx={{ mb: 2 }}>
        {t('cheats.results', { count })}
      </Typography>

      <Stack spacing={3}>
        {sections.map((s) => (
          <Box component="section" key={s.title} aria-label={s.title}>
            <Typography component="h3" variant="h3" gutterBottom>
              {s.title}
            </Typography>
            <Table size="small" aria-label={s.title}>
              <TableBody>
                {s.items.map((it) => (
                  <TableRow key={it.cmd}>
                    <TableCell sx={{ width: '50%', verticalAlign: 'top', p: 1 }}>
                      <Stack direction="row" spacing={1} alignItems="flex-start">
                        <Box
                          component="code"
                          sx={{
                            fontFamily: 'ui-monospace, monospace',
                            fontSize: '0.95rem',
                            bgcolor: 'action.hover',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            wordBreak: 'break-word',
                          }}
                        >
                          {it.cmd}
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ verticalAlign: 'top' }}>{it.desc}</TableCell>
                    <TableCell sx={{ verticalAlign: 'top', width: 1 }}>
                      <CopyButton value={it.cmd} />
                    </TableCell>
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
