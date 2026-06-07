import { useState } from 'react';
import { Box, Button, Chip, Divider, Stack, TextField, Typography } from '@mui/material';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useTranslation } from 'react-i18next';
import CopyButton from '../components/CopyButton';
import { useSettings } from '../context/SettingsContext';

type Kind = 'cpf' | 'cnpj';

const onlyDigits = (s: string) => s.replace(/\D/g, '');

function checkDigit(digits: number[], weights: number[]): number {
  const sum = digits.reduce((acc, d, i) => acc + d * weights[i], 0);
  const r = sum % 11;
  return r < 2 ? 0 : 11 - r;
}

const CPF_W1 = [10, 9, 8, 7, 6, 5, 4, 3, 2];
const CPF_W2 = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2];
const CNPJ_W1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
const CNPJ_W2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

function formatCpf(v: string) {
  return v.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
}
function formatCnpj(v: string) {
  return v.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
}

function validateCpf(raw: string): { ok: boolean; reason?: 'length' } {
  const v = onlyDigits(raw);
  if (v.length !== 11) return { ok: false, reason: 'length' };
  if (/^(\d)\1{10}$/.test(v)) return { ok: false };
  const d = v.split('').map(Number);
  const d1 = checkDigit(d.slice(0, 9), CPF_W1);
  const d2 = checkDigit(d.slice(0, 10), CPF_W2);
  return { ok: d1 === d[9] && d2 === d[10] };
}

function validateCnpj(raw: string): { ok: boolean; reason?: 'length' } {
  const v = onlyDigits(raw);
  if (v.length !== 14) return { ok: false, reason: 'length' };
  if (/^(\d)\1{13}$/.test(v)) return { ok: false };
  const d = v.split('').map(Number);
  const d1 = checkDigit(d.slice(0, 12), CNPJ_W1);
  const d2 = checkDigit(d.slice(0, 13), CNPJ_W2);
  return { ok: d1 === d[12] && d2 === d[13] };
}

function randomDigits(n: number): number[] {
  const arr = new Uint8Array(n);
  crypto.getRandomValues(arr);
  return Array.from(arr, (x) => x % 10);
}

function generateCpf(): string {
  const base = randomDigits(9);
  const d1 = checkDigit(base, CPF_W1);
  const d2 = checkDigit([...base, d1], CPF_W2);
  return formatCpf([...base, d1, d2].join(''));
}
function generateCnpj(): string {
  const base = [...randomDigits(8), 0, 0, 0, 1]; // matriz 0001
  const d1 = checkDigit(base, CNPJ_W1);
  const d2 = checkDigit([...base, d1], CNPJ_W2);
  return formatCnpj([...base, d1, d2].join(''));
}

export default function BrDocTool({ kind }: { kind: Kind }) {
  const { t } = useTranslation();
  const { announce } = useSettings();
  const docLabel = kind.toUpperCase();
  const [generated, setGenerated] = useState('');
  const [toValidate, setToValidate] = useState('');

  const generate = () => {
    const value = kind === 'cpf' ? generateCpf() : generateCnpj();
    setGenerated(value);
    announce(`${t('brdoc.generated', { doc: docLabel })}: ${value}`);
  };

  const result = toValidate.trim() === '' ? null : kind === 'cpf' ? validateCpf(toValidate) : validateCnpj(toValidate);

  return (
    <Box>
      <Box component="section" aria-label={t('brdoc.generate', { doc: docLabel })}>
        <Typography component="h2" variant="h2" gutterBottom>
          {t('brdoc.generate', { doc: docLabel })}
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
          <Button variant="contained" onClick={generate} startIcon={<AutorenewIcon />}>
            {t('brdoc.generate', { doc: docLabel })}
          </Button>
          {generated && (
            <>
              <Typography
                aria-live="polite"
                sx={{ fontFamily: 'ui-monospace, monospace', fontSize: '1.3rem', fontWeight: 700 }}
              >
                {generated}
              </Typography>
              <CopyButton value={generated} />
            </>
          )}
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {t('brdoc.note')}
        </Typography>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box component="section" aria-label={t('brdoc.validate', { doc: docLabel })}>
        <Typography component="h2" variant="h2" gutterBottom>
          {t('brdoc.validate', { doc: docLabel })}
        </Typography>
        <TextField
          label={t('brdoc.validate', { doc: docLabel })}
          value={toValidate}
          onChange={(e) => setToValidate(e.target.value)}
          placeholder={t('brdoc.placeholder')}
          fullWidth
          autoComplete="off"
          inputProps={{ inputMode: 'numeric', spellCheck: false, style: { fontFamily: 'ui-monospace, monospace' } }}
          sx={{ maxWidth: 360 }}
        />
        {result && (
          <Box sx={{ mt: 2 }} aria-live="polite">
            <Chip
              icon={result.ok ? <CheckCircleIcon /> : <CancelIcon />}
              color={result.ok ? 'success' : 'error'}
              label={
                result.ok
                  ? t('brdoc.valid')
                  : result.reason === 'length'
                    ? t('brdoc.invalidLength')
                    : t('brdoc.invalid')
              }
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}
