import { useState } from 'react';
import {
  Box,
  Checkbox,
  FormControlLabel,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import CopyButton from '../components/CopyButton';

// Permission bit weights (standard Unix mode).
const R = 4;
const W = 2;
const X = 1;
const CLASSES = ['owner', 'group', 'other'] as const;
type Cls = (typeof CLASSES)[number];

export default function ChmodCalculator() {
  const { t } = useTranslation();
  // mode is a 12-bit value: special(3) + owner(3) + group(3) + other(3)
  const [mode, setMode] = useState(0o755);

  const digit = (cls: Cls) => {
    const shift = cls === 'owner' ? 6 : cls === 'group' ? 3 : 0;
    return (mode >> shift) & 7;
  };
  const setBit = (cls: Cls, bit: number, on: boolean) => {
    const shift = cls === 'owner' ? 6 : cls === 'group' ? 3 : 0;
    const mask = bit << shift;
    setMode((m) => (on ? m | mask : m & ~mask));
  };
  const special = (mode >> 9) & 7;
  const setSpecial = (bit: number, on: boolean) => {
    const mask = bit << 9;
    setMode((m) => (on ? m | mask : m & ~mask));
  };

  const octal = (special ? special.toString(8) : '0') + (((mode >> 6) & 7).toString(8)) +
    (((mode >> 3) & 7).toString(8)) + ((mode & 7).toString(8));

  const onOctal = (value: string) => {
    const clean = value.replace(/[^0-7]/g, '').slice(-4);
    if (clean === '') {
      setMode(0);
      return;
    }
    setMode(parseInt(clean, 8) & 0o7777);
  };

  // Build the symbolic rwx string, applying setuid/setgid/sticky letters.
  const symbolic = (() => {
    const triad = (d: number, kind: 'u' | 'g' | 'o') => {
      let xChar = d & X ? 'x' : '-';
      if (kind === 'u' && special & 4) xChar = d & X ? 's' : 'S';
      if (kind === 'g' && special & 2) xChar = d & X ? 's' : 'S';
      if (kind === 'o' && special & 1) xChar = d & X ? 't' : 'T';
      return (d & R ? 'r' : '-') + (d & W ? 'w' : '-') + xChar;
    };
    return triad(digit('owner'), 'u') + triad(digit('group'), 'g') + triad(digit('other'), 'o');
  })();

  return (
    <Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
        <TextField
          label={t('tools.chmod.octal')}
          value={octal}
          onChange={(e) => onOctal(e.target.value)}
          inputProps={{ inputMode: 'numeric', maxLength: 4, style: { fontFamily: 'ui-monospace, monospace', fontSize: '1.4rem', letterSpacing: '0.3em' } }}
          sx={{ maxWidth: 180 }}
        />
        <Box>
          <Typography variant="body2" color="text.secondary">
            {t('tools.chmod.symbolic')}
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography sx={{ fontFamily: 'ui-monospace, monospace', fontSize: '1.4rem', letterSpacing: '0.15em' }}>
              {symbolic}
            </Typography>
            <CopyButton value={`${octal} ${symbolic}`} />
          </Stack>
        </Box>
      </Stack>

      <Table size="small" sx={{ mt: 3, maxWidth: 460 }} aria-label={t('tools.chmod.permissions')}>
        <TableHead>
          <TableRow>
            <TableCell>{t('tools.chmod.class')}</TableCell>
            <TableCell align="center">{t('tools.chmod.read')} (4)</TableCell>
            <TableCell align="center">{t('tools.chmod.write')} (2)</TableCell>
            <TableCell align="center">{t('tools.chmod.execute')} (1)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {CLASSES.map((cls) => {
            const d = digit(cls);
            return (
              <TableRow key={cls}>
                <TableCell component="th" scope="row" sx={{ fontWeight: 700 }}>
                  {t(`tools.chmod.${cls}`)}
                </TableCell>
                {[R, W, X].map((bit) => {
                  const labels = { [R]: 'read', [W]: 'write', [X]: 'execute' } as Record<number, string>;
                  return (
                    <TableCell align="center" key={bit}>
                      <Checkbox
                        checked={Boolean(d & bit)}
                        onChange={(e) => setBit(cls, bit, e.target.checked)}
                        inputProps={{
                          'aria-label': `${t(`tools.chmod.${cls}`)} ${t(`tools.chmod.${labels[bit]}`)}`,
                        }}
                      />
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap sx={{ mt: 2 }}>
        <FormControlLabel
          control={<Checkbox checked={Boolean(special & 4)} onChange={(e) => setSpecial(4, e.target.checked)} />}
          label={t('tools.chmod.setuid')}
        />
        <FormControlLabel
          control={<Checkbox checked={Boolean(special & 2)} onChange={(e) => setSpecial(2, e.target.checked)} />}
          label={t('tools.chmod.setgid')}
        />
        <FormControlLabel
          control={<Checkbox checked={Boolean(special & 1)} onChange={(e) => setSpecial(1, e.target.checked)} />}
          label={t('tools.chmod.sticky')}
        />
      </Stack>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        {t('tools.chmod.example')}
      </Typography>
    </Box>
  );
}
