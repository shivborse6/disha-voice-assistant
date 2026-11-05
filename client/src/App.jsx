import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import { questions } from "./questions";
import { speak } from "./speak";
import { listen } from "./listen";
import { recommend } from "./recommend";

const ui = {
  en: { title: "Find your path", start: "Start", done: "Thank you!", restart: "Start again", question: "Question", speak: "🎤 Speak your answer", listening: "Listening...", notUnderstood: "Sorry, I did not understand. Please tap a button.", talk: "Talk to a counsellor", phoneLabel: "Your mobile number", send: "Request a call", sent: "Request received. A counsellor will contact you.", badPhone: "Please enter a 10-digit mobile number." },
  hi: { title: "अपना रास्ता खोजें", start: "शुरू करें", done: "धन्यवाद!", restart: "फिर से शुरू करें", question: "प्रश्न", speak: "🎤 बोलकर जवाब दें", listening: "सुन रहा हूँ...", notUnderstood: "माफ़ कीजिए, समझ नहीं आया। कृपया बटन दबाएँ।", talk: "काउंसलर से बात करें", phoneLabel: "आपका मोबाइल नंबर", send: "कॉल का अनुरोध करें", sent: "अनुरोध मिल गया। काउंसलर आपसे संपर्क करेंगे।", badPhone: "कृपया 10 अंकों का मोबाइल नंबर दें।" },
  mr: { title: "तुमचा मार्ग शोधा", start: "सुरू करा", done: "धन्यवाद!", restart: "पुन्हा सुरू करा", question: "प्रश्न", speak: "🎤 बोलून उत्तर द्या", listening: "ऐकत आहे...", notUnderstood: "माफ करा, समजले नाही. कृपया बटण दाबा.", talk: "समुपदेशकाशी बोला", phoneLabel: "तुमचा मोबाईल नंबर", send: "कॉलची विनंती करा", sent: "विनंती मिळाली. समुपदेशक तुमच्याशी संपर्क करतील.", badPhone: "कृपया १० अंकी मोबाईल नंबर टाका." },
};

const suggestedTitle = {
  en: "Paths that may suit you",
  hi: "आपके लिए ये रास्ते अच्छे हो सकते हैं",
  mr: "तुमच्यासाठी हे मार्ग योग्य असू शकतात",
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
  const [phone, setPhone] = useState("");
  const [callStatus, setCallStatus] = useState(""); // "" | "sent" | "bad" | "error"

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

  async function requestCall() {
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setCallStatus("bad");
      return;
    }
    try {
      await addDoc(collection(db, "escalations"), {
        phone,
        language: lang,
        answers,
        status: "new",
        createdAt: serverTimestamp(),
      });
      setCallStatus("sent");
    } catch (error) {
      console.error(error);
      setCallStatus("error");
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
    setPhone("");
    setCallStatus("");
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
          <h2>{suggestedTitle[lang]}</h2>
          {recommend(answers).map((t) => (
            <div
              key={t.id}
              style={{ background: "white", borderRadius: 12, padding: 16, margin: "12px auto", maxWidth: 360, textAlign: "left" }}
            >
              <h3>{t.name[lang]}</h3>
              <p>{t.summary[lang]}</p>
            </div>
          ))}
          <p>{saveStatus}</p>

          <div style={{ background: "white", borderRadius: 12, padding: 16, margin: "16px auto", maxWidth: 360 }}>
            <h3>{ui[lang].talk}</h3>
            {callStatus === "sent" ? (
              <p>{ui[lang].sent}</p>
            ) : (
              <>
                <label>{ui[lang].phoneLabel}</label>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  style={{ display: "block", width: "100%", boxSizing: "border-box", fontSize: 22, padding: 12, margin: "8px 0", borderRadius: 8, border: "1px solid #ccc" }}
                />
                {callStatus === "bad" && <p>{ui[lang].badPhone}</p>}
                {callStatus === "error" && <p>Could not send. Please try again.</p>}
                <button style={{ ...bigButton, margin: "8px 0" }} onClick={requestCall}>
                  {ui[lang].send}
                </button>
              </>
            )}
          </div>

          <button style={bigButton} onClick={restart}>{ui[lang].restart}</button>
        </>
      )}
    </div>
  );
}