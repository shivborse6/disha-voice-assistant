const langCodes = { en: "en-IN", hi: "hi-IN", mr: "mr-IN" };

export function listen(lang, onResult, onError) {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    onError("not-supported");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = langCodes[lang];
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event) => onResult(event.results[0][0].transcript);
  recognition.onerror = (event) => onError(event.error);

  recognition.start();
}