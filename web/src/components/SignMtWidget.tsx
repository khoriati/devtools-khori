import { useState } from 'react';
import { Box, Dialog, DialogContent, DialogTitle, Fab, IconButton, Typography } from '@mui/material';
import SignLanguageIcon from '@mui/icons-material/SignLanguage';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../context/SettingsContext';

/**
 * sign.mt integration — sign-language translation for the non-Portuguese
 * languages (Portuguese is covered by VLibras instead, see VLibrasWidget.tsx).
 *
 * sign.mt (https://sign.mt, source: github.com/sign/translate) is an
 * open-source translator whose models run on-device. It needs **no API key and
 * no paid SaaS account**, so we embed it (in an accessible dialog) instead of
 * calling a keyed service. The spoken/signed language pair is preselected via
 * its URL params: `spl` (spoken) and `sil` (signed, ISO 639-3 sign-language code).
 *
 * For languages that have no free/keyless sign-language option, simply leave them
 * out of SIGN_MT below and nothing is shown. See docs/VLIBRAS.md (sign-language).
 */

// Map each UI language to a sign.mt spoken→signed pair.
//   ase = American SL · ssp = Spanish SL · gsg = German SL (DGS) · fsl = French SL (LSF)
const SIGN_MT: Record<string, { spl: string; sil: string }> = {
  'en-US': { spl: 'en', sil: 'ase' },
  es: { spl: 'es', sil: 'ssp' },
  de: { spl: 'de', sil: 'gsg' },
  fr: { spl: 'fr', sil: 'fsl' },
};

export default function SignMtWidget() {
  const { t } = useTranslation();
  const { language } = useSettings();
  const [open, setOpen] = useState(false);

  const pair = SIGN_MT[language];
  if (!pair) return null; // pt-BR uses VLibras; unsupported languages show nothing.

  const src = `https://sign.mt/?spl=${pair.spl}&sil=${pair.sil}`;

  return (
    <>
      {/* Floating access button, pinned bottom-right (mirrors VLibras' placement).
          The visible text IS the accessible name (no Tooltip override) so it
          satisfies WCAG 2.5.3 "Label in Name". */}
      <Fab
        color="primary"
        variant="extended"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        sx={{ position: 'fixed', bottom: '1rem', right: '1rem', zIndex: 1400, textTransform: 'none' }}
      >
        <SignLanguageIcon sx={{ mr: 1 }} aria-hidden="true" />
        {t('signLang.button')}
      </Fab>

      {/* MUI Dialog gives us a focus trap, Esc-to-close and aria-modal for free. */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md" aria-labelledby="signmt-title">
        <DialogTitle id="signmt-title" sx={{ pr: 6 }}>
          {t('signLang.title')}
          <IconButton
            onClick={() => setOpen(false)}
            aria-label={t('signLang.close')}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box
            component="iframe"
            src={src}
            title={t('signLang.title')}
            sx={{ width: '100%', height: '70vh', border: 0 }}
            // allow microphone/camera so sign.mt's speech & camera features work if used.
            allow="microphone; camera"
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {t('signLang.poweredBy')}
          </Typography>
        </DialogContent>
      </Dialog>
    </>
  );
}
