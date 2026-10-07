// The "Listen" buttons (src/components/Listen.astro): say a word with the
// browser's own speech synthesis.
//
// Only voices installed on the device are used (localService). Some browsers also
// offer online voices, which would send the text to a server, so those are skipped.
// If there is no installed Mandarin voice, the buttons stay hidden.

const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-say]'));

// Apple's novelty voices (Eloquence) also speak Chinese, but sound robotic. Use them only if nothing else is installed.
const NOVELTY = /^(Eddy|Flo|Grandma|Grandpa|Reed|Rocko|Sandy|Shelley)\b/;

function mandarinVoice(): SpeechSynthesisVoice | undefined {
  const voices = speechSynthesis.getVoices().filter((v) => v.localService && /^zh[-_](CN|Hans)/i.test(v.lang));
  return voices.find((v) => !NOVELTY.test(v.name)) ?? voices[0];
}

function setUp() {
  const voice = mandarinVoice();
  if (!voice) return;

  for (const button of buttons) {
    button.hidden = false;
    if (button.dataset.ready) continue;
    button.dataset.ready = 'true';
    button.addEventListener('click', () => {
      speechSynthesis.cancel();
      // "…" is left in some phrases ("我叫…") to show where a word goes. It is not said.
      const utterance = new SpeechSynthesisUtterance(button.dataset.say!.replace(/…/g, ''));
      utterance.voice = mandarinVoice() ?? voice;
      utterance.lang = utterance.voice.lang;
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    });
  }
}

if (buttons.length > 0 && 'speechSynthesis' in window) {
  // Voices often load a moment after the page does.
  speechSynthesis.addEventListener('voiceschanged', setUp);
  setUp();
}
