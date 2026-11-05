import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import { questions } from "./questions";
import { speak } from "./speak";
import { listen } from "./listen";

const ui = {
  en: { title: "Find your path", start: "Start", done: "Thank you!", restart: "Start again", question: "Question", speak: "🎤 Speak your answer", listening: "Listening...", notUnderstood: "Sorry, I did not understand. Please tap a button." },
  hi: { title: "अपना रास्ता खोजें", start: "शुरू करें", done: "धन्यवाद!", restart: "फिर से शुरू करें", question: "प्रश्न", speak: "🎤 बोलकर जवाब दें", listening: "सुन रहा हूँ...", notUnderstood: "माफ़ कीजिए, समझ नहीं आया। कृपया बटन दबाएँ।" },
  mr: { title: "तुमचा मार्ग शोधा", start: "सुरू करा", done: "धन्यवाद!", restart: "पुन्हा सुरू करा", question: "प्रश्न", speak: "🎤 बोलून उत्तर द्या", listening: "ऐकत आहे...", notUnderstood: "माफ करा, समजले नाही. कृपया बटण दाबा." },
};

const bigButton = { display: "block", width: "100%", maxWidth: 360, margin: "12px auto", fontSize: 22, padding: "14px 20px" };

export default function App() {
  const [lang, setLang] = useState("en");
  const [screen, setScreen] = useState("home"); // "home" | "interview" | "done"
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [listening, setListening] = useState(false);
  const [message, setMessage] = useState("");
  const [saveStatus, setSaveStatus] = useState("");

  async function saveProfile(finalAnswers) {
    setSaveStatus("Saving...");
    try {
      await addDoc(collection(db, "profiles"), {
        answers: finalAnswers,
        language: lang,
        createdAt: serverTimestamp(),
      });
      setSaveStatus("Saved ✓");
    } catch (error) {
      console.error(error);
      setSaveStatus("Could not save");
    }
  }

  function handleAnswer(questionId, value) {
    setMessage("");
    const updated = { ...answers, [questionId]: value };
    setAnswers(updated);
    if (step + 1 < questions.length) {
      setStep(step + 1);
    } else {
      setScreen("done");
      saveProfile(updated);
    }
  }

  function restart() {
    setAnswers({});
    setStep(0);
    setMessage("");
    setSaveStatus("");
    setScreen("home");
  }

  const q = questions[step];

  function handleVoice() {
    setMessage("");
    setListening(true);
    listen(
      lang,
      (text) => {
        setListening(false);
        const spoken = text.toLowerCase();
        const found = q.options.find((opt) =>
          spoken.includes(opt.label[lang].toLowerCase())
        );
        if (found) {
          handleAnswer(q.id, found.value);
        } else {
          setMessage(ui[lang].notUnderstood);
        }
      },
      () => {
        setListening(false);
        setMessage(ui[lang].notUnderstood);
      }
    );
  }

  return (
    <div style={{ padding: 24, textAlign: "center" }}>
      <div>
        <button onClick={() => setLang("en")}>English</button>
        <button onClick={() => setLang("hi")}>हिंदी</button>
        <button onClick={() => setLang("mr")}>मराठी</button>
      </div>

      {screen === "home" && (
        <>
          <h1>{ui[lang].title}</h1>
          <button style={bigButton} onClick={() => setScreen("interview")}>
            {ui[lang].start}
          </button>
        </>
      )}

      {screen === "interview" && (
        <>
          <p>{ui[lang].question} {step + 1} / {questions.length}</p>
          <h2>{q.text[lang]}</h2>
          <button style={bigButton} onClick={() => speak(q.text[lang], lang)}>
            🔊 Listen
          </button>
          <button style={bigButton} onClick={handleVoice} disabled={listening}>
            {listening ? ui[lang].listening : ui[lang].speak}
          </button>
          {message && <p>{message}</p>}
          {q.options.map((opt) => (
            <button key={opt.value} style={bigButton} onClick={() => handleAnswer(q.id, opt.value)}>
              {opt.label[lang]}
            </button>
          ))}
        </>
      )}

      {screen === "done" && (
        <>
          <h1>{ui[lang].done}</h1>
          <pre style={{ textAlign: "left", display: "inline-block" }}>
            {JSON.stringify(answers, null, 2)}
          </pre>
          <p>{saveStatus}</p>
          <button style={bigButton} onClick={restart}>{ui[lang].restart}</button>
        </>
      )}
    </div>
  );
}