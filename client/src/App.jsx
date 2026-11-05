import { useState } from "react";
import { questions } from "./questions";

const ui = {
  en: { title: "Find your path", start: "Start", done: "Thank you!", restart: "Start again", question: "Question" },
  hi: { title: "अपना रास्ता खोजें", start: "शुरू करें", done: "धन्यवाद!", restart: "फिर से शुरू करें", question: "प्रश्न" },
  mr: { title: "तुमचा मार्ग शोधा", start: "सुरू करा", done: "धन्यवाद!", restart: "पुन्हा सुरू करा", question: "प्रश्न" },
};

const bigButton = { display: "block", width: "100%", maxWidth: 360, margin: "12px auto", fontSize: 22, padding: "14px 20px" };

export default function App() {
  const [lang, setLang] = useState("en");
  const [screen, setScreen] = useState("home"); // "home" | "interview" | "done"
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  function handleAnswer(questionId, value) {
    setAnswers({ ...answers, [questionId]: value });
    if (step + 1 < questions.length) {
      setStep(step + 1);
    } else {
      setScreen("done");
    }
  }

  function restart() {
    setAnswers({});
    setStep(0);
    setScreen("home");
  }

  const q = questions[step];

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
          <button style={bigButton} onClick={restart}>{ui[lang].restart}</button>
        </>
      )}
    </div>
  );
}