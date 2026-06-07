import { useRef, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Fab,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import SignLanguageIcon from '@mui/icons-material/SignLanguage';
import CloseIcon from '@mui/icons-material/Close';
import TranslateIcon from '@mui/icons-material/Translate';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../context/SettingsContext';

/**
 * sign.mt integration — sign-language translation for the non-Portuguese
 * languages (Portuguese uses VLibras instead, see VLibrasWidget.tsx).
 *
 * sign.mt (https://sign.mt, source: github.com/sign/translate) is an
 * open-source translator whose models run on-device — **no API key, no SaaS
 * account**. We deep-link into it with the spoken/signed language pair and the
 * text to translate, via its URL params: `spl` (spoken), `sil` (signed,
 * ISO 639-3) and `text`.
 *
 * Why not self-hosted? The sign.mt repo is a ~1.2 GB Ionic/Angular app (native
 * projects + on-device ML models, custom license) — impractical to vendor.
 * Instead we make the integration *robust and dynamic*: when opened, it is
 * pre-filled with the user's current selection (or the on-screen content) so a
 * Deaf user can immediately translate what is on the page, and the text stays
 * editable + re-translatable. See docs/VLIBRAS.md (sign-language section).
 */

// UI language -> sign.mt spoken (`spl`) + signed (`sil`) pair.
//   ase = American SL · ssp = Spanish SL · gsg = German SL (DGS) · fsl = French SL (LSF)
const SIGN_MT: Record<string, { spl: string; sil: string }> = {
  'en-US': { spl: 'en', sil: 'ase' },
  es: { spl: 'es', sil: 'ssp' },
  de: { spl: 'de', sil: 'gsg' },
  fr: { spl: 'fr', sil: 'fsl' },
};

const MAX_TEXT = 600;

// The current text selection, or the main content as a fallback.
function readScreenText(selection: string): string {
  if (selection) return selection.slice(0, MAX_TEXT);
  const main = document.getElementById('main-content');
  return (main?.innerText || '').replace(/\s+/g, ' ').trim().slice(0, MAX_TEXT);
}

export default function SignMtWidget() {
  const { t } = useTranslation();
  const { language } = useSettings();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(''); // editable text in the dialog
  const [submitted, setSubmitted] = useState(''); // text currently loaded in the iframe
  // Captured on pointer-down because clicking the button can clear the selection.
  const selectionRef = useRef('');

  const pair = SIGN_MT[language];
  if (!pair) return null; // pt-BR uses VLibras; unsupported languages show nothing.

  const openDialog = () => {
    const initial = readScreenText(selectionRef.current);
    setText(initial);
    setSubmitted(initial);
    setOpen(true);
  };

  const src = `https://sign.mt/?spl=${pair.spl}&sil=${pair.sil}&text=${encodeURIComponent(submitted)}`;

  return (
    <>
      {/* Floating access button, pinned bottom-right (mirrors VLibras' placement).
          The visible text IS the accessible name (no Tooltip override → WCAG 2.5.3). */}
      <Fab
        color="primary"
        variant="extended"
        onMouseDown={() => {
          selectionRef.current = window.getSelection?.()?.toString().trim() || '';
        }}
        onClick={openDialog}
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
          <Stack spacing={1.5}>
            <Typography variant="body2" color="text.secondary">
              {t('signLang.hint')}
            </Typography>
            {/* Editable text → keeps the translation dynamic: the user can refine
                the captured selection/page text and re-translate. */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems="flex-start">
              <TextField
                label={t('signLang.textLabel')}
                value={text}
                onChange={(e) => setText(e.target.value)}
                fullWidth
                multiline
                maxRows={4}
                inputProps={{ maxLength: MAX_TEXT }}
              />
              <Button
                variant="contained"
                onClick={() => setSubmitted(text)}
                startIcon={<TranslateIcon />}
                disabled={!text.trim() || text === submitted}
                sx={{ mt: { sm: 1 }, flexShrink: 0 }}
              >
                {t('signLang.translate')}
              </Button>
            </Stack>
            <Box
              component="iframe"
              key={src} /* reload the player when the text/pair changes */
              src={src}
              title={t('signLang.title')}
              sx={{ width: '100%', height: '60vh', border: 0 }}
              allow="microphone; camera"
            />
            <Typography variant="body2" color="text.secondary">
              {t('signLang.poweredBy')}
            </Typography>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
}
