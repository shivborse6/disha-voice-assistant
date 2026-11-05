
import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import { questions } from "./questions";
import { speak } from "./speak";
import { listen } from "./listen";
import { recommend, recommendQualifications } from "./recommend";

const ui = {
  en: {
    title: "Find your path",
    start: "Start",
    done: "Thank you!",
    restart: "Start again",
    question: "Question",
    speak: "🎤 Speak your answer",
    listening: "Listening...",
    notUnderstood: "Sorry, I did not understand. Please tap a button.",
    talk: "Talk to a counsellor",
    phoneLabel: "Your mobile number",
    send: "Request a call",
    sent: "Request received. A counsellor will contact you.",
    badPhone: "Please enter a valid 10-digit mobile number.",
    tradesTitle: "Livelihood suggestions",
    nsqfTitle: "NSQF-aligned qualifications",
    level: "NSQF Level",
    duration: "Duration",
    hours: "hours",
    eligibility: "Eligibility guidance",
    source: "View official qualification",
    matchedRoute: "Matched entry route",
    disclaimer: "These are preliminary recommendations. Final eligibility must be verified with the training provider.",
  },

  hi: {
    title: "अपना रास्ता खोजें",
    start: "शुरू करें",
    done: "धन्यवाद!",
    restart: "फिर से शुरू करें",
    question: "प्रश्न",
    speak: "🎤 बोलकर जवाब दें",
    listening: "सुन रहा हूँ...",
    notUnderstood: "माफ़ कीजिए, समझ नहीं आया। कृपया बटन दबाएँ।",
    talk: "काउंसलर से बात करें",
    phoneLabel: "आपका मोबाइल नंबर",
    send: "कॉल का अनुरोध करें",
    sent: "अनुरोध मिल गया। काउंसलर आपसे संपर्क करेंगे।",
    badPhone: "कृपया सही 10 अंकों का मोबाइल नंबर दें।",
    tradesTitle: "आजीविका के सुझाव",
    nsqfTitle: "NSQF आधारित योग्यताएँ",
    level: "NSQF स्तर",
    duration: "अवधि",
    hours: "घंटे",
    eligibility: "पात्रता संबंधी जानकारी",
    source: "आधिकारिक योग्यता देखें",
    matchedRoute: "मिलता-जुलता प्रवेश मार्ग",
    disclaimer: "ये शुरुआती सुझाव हैं। अंतिम पात्रता प्रशिक्षण प्रदाता से सत्यापित करें।",
  },

  mr: {
    title: "तुमचा मार्ग शोधा",
    start: "सुरू करा",
    done: "धन्यवाद!",
    restart: "पुन्हा सुरू करा",
    question: "प्रश्न",
    speak: "🎤 बोलून उत्तर द्या",
    listening: "ऐकत आहे...",
    notUnderstood: "माफ करा, समजले नाही. कृपया बटण दाबा.",
    talk: "समुपदेशकाशी बोला",
    phoneLabel: "तुमचा मोबाईल नंबर",
    send: "कॉलची विनंती करा",
    sent: "विनंती मिळाली. समुपदेशक तुमच्याशी संपर्क करतील.",
    badPhone: "कृपया योग्य १० अंकी मोबाईल नंबर टाका.",
    tradesTitle: "उपजीविकेसाठी सूचना",
    nsqfTitle: "NSQF आधारित पात्रता",
    level: "NSQF स्तर",
    duration: "कालावधी",
    hours: "तास",
    eligibility: "पात्रतेची माहिती",
    source: "अधिकृत पात्रता पहा",
    matchedRoute: "जुळणारा प्रवेश मार्ग",
    disclaimer: "या प्राथमिक सूचना आहेत. अंतिम पात्रता प्रशिक्षण संस्थेकडून तपासून घ्या.",
  },
};

const suggestedTitle = {
  en: "Paths that may suit you",
  hi: "आपके लिए ये रास्ते अच्छे हो सकते हैं",
  mr: "तुमच्यासाठी हे मार्ग योग्य असू शकतात",
};

const bigButton = {
  display: "block",
  width: "100%",
  maxWidth: 360,
  margin: "12px auto",
  fontSize: 20,
  padding: "14px 20px",
  cursor: "pointer",
  borderRadius: 8,
};

const cardStyle = {
  background: "white",
  borderRadius: 12,
  padding: 20,
  margin: "14px auto",
  maxWidth: 460,
  textAlign: "left",
  boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
};

export default function App() {
  const [lang, setLang] = useState("en");
  const [screen, setScreen] = useState("home");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [listening, setListening] = useState(false);
  const [message, setMessage] = useState("");
  const [saveStatus, setSaveStatus] = useState("");
  const [phone, setPhone] = useState("");
  const [callStatus, setCallStatus] = useState("");
  const [sendingCall, setSendingCall] = useState(false);

  // Save interview profile to Firebase
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
      console.error("Profile saving error:", error);
      setSaveStatus("Could not save profile");
    }
  }

  // Request counsellor callback
  async function requestCall() {
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setCallStatus("bad");
      return;
    }

    setSendingCall(true);
    setCallStatus("");

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
      console.error("Callback request error:", error);
      setCallStatus("error");
    } finally {
      setSendingCall(false);
    }
  }

  // Handle button-based answers
  function handleAnswer(questionId, value) {
    setMessage("");

    const updated = {
      ...answers,
      [questionId]: value,
    };

    setAnswers(updated);

    if (step + 1 < questions.length) {
      setStep(step + 1);
    } else {
      setScreen("done");
      saveProfile(updated);
    }
  }

  // Restart the interview
  function restart() {
    setAnswers({});
    setStep(0);
    setMessage("");
    setSaveStatus("");
    setPhone("");
    setCallStatus("");
    setSendingCall(false);
    setScreen("home");
  }

  // Current interview question
  const q = questions[step];

  // Voice-based answer
  function handleVoice() {
    setMessage("");
    setListening(true);

    listen(
      lang,
      (text) => {
        setListening(false);

        const spoken = text.toLowerCase().trim();

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

  // Recommendations
  const tradeRecommendations =
    screen === "done" ? recommend(answers) : [];

  const qualificationRecommendations =
    screen === "done" ? recommendQualifications(answers) : [];

  return (
    <div
      style={{
        padding: 24,
        textAlign: "center",
        minHeight: "100vh",
        background: "#f4f7fb",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Language selection */}
      <div style={{ marginBottom: 25 }}>
        <button onClick={() => setLang("en")}>English</button>
        <button onClick={() => setLang("hi")}>हिंदी</button>
        <button onClick={() => setLang("mr")}>मराठी</button>
      </div>

      {/* Home screen */}
      {screen === "home" && (
        <>
          <h1>{ui[lang].title}</h1>

          <p>
            Discover livelihood opportunities and skill development
            pathways.
          </p>

          <button
            style={bigButton}
            onClick={() => setScreen("interview")}
          >
            {ui[lang].start}
          </button>
        </>
      )}

      {/* Interview screen */}
      {screen === "interview" && q && (
        <>
          <p>
            {ui[lang].question} {step + 1} / {questions.length}
          </p>

          <div
            style={{
              width: "100%",
              maxWidth: 360,
              height: 8,
              background: "#ddd",
              borderRadius: 10,
              margin: "15px auto 25px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${((step + 1) / questions.length) * 100}%`,
                height: "100%",
                background: "#2563eb",
                transition: "width 0.3s",
              }}
            />
          </div>

          <h2>{q.text[lang]}</h2>

          <button
            style={bigButton}
            onClick={() => speak(q.text[lang], lang)}
          >
            🔊 Listen
          </button>

          <button
            style={bigButton}
            onClick={handleVoice}
            disabled={listening}
          >
            {listening ? ui[lang].listening : ui[lang].speak}
          </button>

          {message && (
            <p style={{ color: "#dc2626" }}>{message}</p>
          )}

          {q.options.map((opt) => (
            <button
              key={opt.value}
              style={bigButton}
              onClick={() => handleAnswer(q.id, opt.value)}
            >
              {opt.label[lang]}
            </button>
          ))}
        </>
      )}

      {/* Results screen */}
      {screen === "done" && (
        <>
          <h1>{ui[lang].done}</h1>

          <h2>{suggestedTitle[lang]}</h2>

          {/* Livelihood recommendations */}
          <h2>{ui[lang].tradesTitle}</h2>

          {tradeRecommendations.length > 0 ? (
            tradeRecommendations.map((trade) => (
              <div key={trade.id} style={cardStyle}>
                <h3>{trade.name[lang]}</h3>
                <p>{trade.summary[lang]}</p>
              </div>
            ))
          ) : (
            <p>No livelihood suggestions available.</p>
          )}

          {/* NSQF recommendations */}
          <h2>{ui[lang].nsqfTitle}</h2>

          {qualificationRecommendations.length > 0 ? (
            qualificationRecommendations.map((qualification) => (
              <div key={qualification.id} style={cardStyle}>
                <h3>{qualification.name[lang]}</h3>

                <p>
                  <strong>{ui[lang].level}:</strong>{" "}
                  {qualification.nsqfLevel}
                </p>

                <p>
                  <strong>{ui[lang].duration}:</strong>{" "}
                  {qualification.durationHours} {ui[lang].hours}
                </p>

                <p>
                  <strong>{ui[lang].eligibility}:</strong>
                </p>

                <p>{qualification.eligibilityMessage}</p>

                <p>
                  <strong>{qualification.eligibilityStatus}</strong>
                </p>

                {qualification.matchedRoute && (
  <p>
    <strong>{ui[lang].matchedRoute}:</strong>{" "}
    {qualification.matchedRoute.education === "12th"
      ? "12th pass with no experience"
      : qualification.matchedRoute.education === "10th" &&
        qualification.matchedRoute.certificate === "yes"
      ? "10th pass with NTC/NAC/CITS"
      : qualification.matchedRoute.education === "10th" &&
        qualification.matchedRoute.experience === "3_or_more"
      ? "10th pass with 3 years of experience"
      : "Other entry route"}
  </p>
)}

                <p>
                  <a
                    href={qualification.source}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {ui[lang].source} ↗
                  </a>
                </p>

                <p style={{ fontSize: 13, color: "#666" }}>
                  {qualification.recommendationNote}
                </p>
              </div>
            ))
          ) : (
            <p>No NSQF qualifications available yet.</p>
          )}

          <p
            style={{
              maxWidth: 460,
              margin: "20px auto",
              color: "#666",
              fontSize: 14,
            }}
          >
            {ui[lang].disclaimer}
          </p>

          <p>{saveStatus}</p>

          {/* Counsellor callback */}
          <div style={cardStyle}>
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
                  onChange={(e) => {
                    setPhone(e.target.value.replace(/\D/g, ""));
                    setCallStatus("");
                  }}
                  style={{
                    display: "block",
                    width: "100%",
                    boxSizing: "border-box",
                    fontSize: 20,
                    padding: 12,
                    margin: "12px 0",
                    borderRadius: 8,
                    border: "1px solid #ccc",
                  }}
                />

                {callStatus === "bad" && (
                  <p style={{ color: "red" }}>
                    {ui[lang].badPhone}
                  </p>
                )}

                {callStatus === "error" && (
                  <p style={{ color: "red" }}>
                    Could not send. Please try again.
                  </p>
                )}

                <button
                  style={bigButton}
                  onClick={requestCall}
                  disabled={sendingCall}
                >
                  {sendingCall ? "Sending..." : ui[lang].send}
                </button>
              </>
            )}
          </div>

          <button style={bigButton} onClick={restart}>
            {ui[lang].restart}
          </button>
        </>
      )}
    </div>
  );
}
