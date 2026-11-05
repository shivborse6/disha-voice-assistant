import { useState } from "react";

export default function App() {
  const [lang, setLang] = useState("en");

  const text = {
    en: { title: "Find your path", start: "Start" },
    hi: { title: "अपना रास्ता खोजें", start: "शुरू करें" },
    mr: { title: "तुमचा मार्ग शोधा", start: "सुरू करा" },
  };

  return (
    <div style={{ padding: 24, textAlign: "center" }}>
      <div>
        <button onClick={() => setLang("en")}>English</button>
        <button onClick={() => setLang("hi")}>हिंदी</button>
        <button onClick={() => setLang("mr")}>मराठी</button>
      </div>
      <h1>{text[lang].title}</h1>
      <button style={{ fontSize: 24, padding: "12px 32px" }}>
        {text[lang].start}
      </button>
    </div>
  );
}