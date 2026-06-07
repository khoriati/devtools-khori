import { useMemo, useState } from 'react';
import { Alert, Box, Grid, Stack, Table, TableBody, TableCell, TableRow, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const octets = (v: string): number[] | null => {
  const parts = v.trim().split('.');
  if (parts.length !== 4) return null;
  const nums = parts.map((p) => (/^\d{1,3}$/.test(p) ? Number(p) : NaN));
  if (nums.some((n) => Number.isNaN(n) || n < 0 || n > 255)) return null;
  return nums;
};
const toInt = (o: number[]) => ((o[0] << 24) | (o[1] << 16) | (o[2] << 8) | o[3]) >>> 0;
const toIp = (n: number) => [24, 16, 8, 0].map((s) => (n >>> s) & 255).join('.');
const prefixToMask = (p: number) => (p === 0 ? 0 : (0xffffffff << (32 - p)) >>> 0);

// Returns prefix length if the mask is a valid contiguous netmask, else null.
const maskToPrefix = (n: number): number | null => {
  const bin = n.toString(2).padStart(32, '0');
  const m = bin.match(/^(1*)(0*)$/);
  return m && m[1].length + m[2].length === 32 ? m[1].length : null;
};

function classify(o: number[]): string {
  const first = o[0];
  if (first < 128) return 'A';
  if (first < 192) return 'B';
  if (first < 224) return 'C';
  if (first < 240) return 'D (multicast)';
  return 'E';
}
function isPrivate(o: number[]): boolean {
  return (
    o[0] === 10 ||
    (o[0] === 172 && o[1] >= 16 && o[1] <= 31) ||
    (o[0] === 192 && o[1] === 168) ||
    (o[0] === 127)
  );
}

export default function IpCalculator() {
  const { t } = useTranslation();
  const [ip, setIp] = useState('192.168.1.10');
  const [prefix, setPrefix] = useState(24);
  const [maskText, setMaskText] = useState('255.255.255.0');

  // Editing the netmask field drives the prefix (and vice-versa) — round trip.
  const onMask = (value: string) => {
    setMaskText(value);
    const o = octets(value);
    if (o) {
      const p = maskToPrefix(toInt(o));
      if (p !== null) setPrefix(p);
    }
  };
  const onPrefix = (value: string) => {
    const p = Math.max(0, Math.min(32, Number(value.replace(/[^0-9]/g, '') || '0')));
    setPrefix(p);
    setMaskText(toIp(prefixToMask(p)));
  };

  const info = useMemo(() => {
    const o = octets(ip);
    if (!o) return null;
    const ipInt = toInt(o);
    const maskInt = prefixToMask(prefix);
    const network = ipInt & maskInt;
    const broadcast = (network | (~maskInt >>> 0)) >>> 0;
    const hostBits = 32 - prefix;
    const total = 2 ** hostBits;
    const usable = prefix >= 31 ? (prefix === 32 ? 1 : 2) : total - 2;
    const firstHost = prefix >= 31 ? network : (network + 1) >>> 0;
    const lastHost = prefix >= 31 ? broadcast : (broadcast - 1) >>> 0;
    return {
      network: toIp(network),
      broadcast: toIp(broadcast),
      mask: toIp(maskInt),
      wildcard: toIp(~maskInt >>> 0),
      cidr: `${toIp(network)}/${prefix}`,
      first: toIp(firstHost),
      last: toIp(lastHost),
      total: total.toLocaleString(),
      usable: usable.toLocaleString(),
      klass: classify(o),
      priv: isPrivate(o),
    };
  }, [ip, prefix]);

  const ipInvalid = ip.length > 0 && !octets(ip);
  const maskInvalid = maskText.length > 0 && (() => {
    const o = octets(maskText);
    return !o || maskToPrefix(toInt(o)) === null;
  })();

  const rows: [string, string][] = info
    ? [
        [t('tools.ip-calculator.cidr'), info.cidr],
        [t('tools.ip-calculator.network'), info.network],
        [t('tools.ip-calculator.broadcast'), info.broadcast],
        [t('tools.ip-calculator.mask'), info.mask],
        [t('tools.ip-calculator.wildcard'), info.wildcard],
        [t('tools.ip-calculator.hostRange'), `${info.first} – ${info.last}`],
        [t('tools.ip-calculator.totalHosts'), info.total],
        [t('tools.ip-calculator.usableHosts'), info.usable],
        [t('tools.ip-calculator.ipClass'), info.klass],
        [t('tools.ip-calculator.scope'), info.priv ? t('tools.ip-calculator.private') : t('tools.ip-calculator.public')],
      ]
    : [];

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={5}>
          <TextField
            label={t('tools.ip-calculator.address')}
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            error={ipInvalid}
            helperText={ipInvalid ? t('tools.ip-calculator.invalidIp') : ' '}
            fullWidth
            autoComplete="off"
            inputProps={{ spellCheck: false, style: { fontFamily: 'ui-monospace, monospace' } }}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <TextField
            label={t('tools.ip-calculator.prefix')}
            value={prefix}
            onChange={(e) => onPrefix(e.target.value)}
            type="number"
            fullWidth
            inputProps={{ min: 0, max: 32, style: { fontFamily: 'ui-monospace, monospace' } }}
            helperText=" "
          />
        </Grid>
        <Grid item xs={6} sm={4}>
          <TextField
            label={t('tools.ip-calculator.netmask')}
            value={maskText}
            onChange={(e) => onMask(e.target.value)}
            error={maskInvalid}
            helperText={maskInvalid ? t('tools.ip-calculator.invalidMask') : ' '}
            fullWidth
            autoComplete="off"
            inputProps={{ spellCheck: false, style: { fontFamily: 'ui-monospace, monospace' } }}
          />
        </Grid>
      </Grid>

      {ipInvalid && (
        <Alert severity="error" role="alert" sx={{ mt: 1 }}>
          {t('tools.ip-calculator.invalidIp')}
        </Alert>
      )}

      {info && (
        <Box
          component="section"
          aria-label={t('common.result')}
          tabIndex={0}
          sx={{ mt: 2, outline: 'none' }}
          aria-live="polite"
        >
          <Typography component="h3" variant="h3" gutterBottom>
            {t('common.result')}
          </Typography>
          <Table size="small" aria-label={t('common.result')}>
            <TableBody>
              {rows.map(([k, v]) => (
                <TableRow key={k}>
                  <TableCell component="th" scope="row" sx={{ fontWeight: 700, width: '45%' }}>
                    {k}
                  </TableCell>
                  <TableCell sx={{ fontFamily: 'ui-monospace, monospace' }}>{v}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}

      <Stack sx={{ mt: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {t('tools.ip-calculator.note')}
        </Typography>
      </Stack>
    </Box>
  );
}
