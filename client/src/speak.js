const langCodes = { en: "en-IN", hi: "hi-IN", mr: "mr-IN" };

export function speak(text, lang) {
  if (!("speechSynthesis" in window)) {
    alert("Sorry, your browser cannot read aloud.");
    return;
  }

  window.speechSynthesis.cancel(); // stop anything already playing

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = langCodes[lang];
  utterance.rate = 0.9; // slightly slower is easier to follow

  // Pick a matching voice if the browser has one
  const voices = window.speechSynthesis.getVoices();
  const match = voices.find((v) => v.lang === langCodes[lang]);
  if (match) utterance.voice = match;

  window.speechSynthesis.speak(utterance);
}