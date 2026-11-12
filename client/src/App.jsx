
import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import { questions } from "./questions";
import { speak } from "./speak";
import { listen } from "./listen";
import { recommend, recommendQualifications } from "./recommend";
import FamilyGuide from "./FamilyGuide";

const ui = {
  en: {
    title: "Find your path",
    subtitle: "Discover livelihood opportunities and skill development pathways.",
    start: "Start",
    done: "Thank you!",
    restart: "Start again",
    question: "Question",
    listen: "🔊 Listen",
    speak: "🎤 Speak your answer",
    listening: "Listening...",
    notUnderstood: "Sorry, I did not understand. Please tap a button.",
    talk: "Talk to a counsellor",
    phoneLabel: "Your mobile number",
    send: "Request a call",
    sending: "Sending...",
    sendError: "Could not send. Please try again.",
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
    disclaimer:
      "These are preliminary recommendations. Final eligibility must be verified with the training provider.",
  },

  hi: {
    title: "अपना रास्ता खोजें",
    subtitle: "आजीविका के अवसर और कौशल विकास के रास्ते जानें।",
    start: "शुरू करें",
    done: "धन्यवाद!",
    restart: "फिर से शुरू करें",
    question: "प्रश्न",
    listen: "🔊 सुनें",
    speak: "🎤 बोलकर जवाब दें",
    listening: "सुन रहा हूँ...",
    notUnderstood: "माफ़ कीजिए, समझ नहीं आया। कृपया बटन दबाएँ।",
    talk: "काउंसलर से बात करें",
    phoneLabel: "आपका मोबाइल नंबर",
    send: "कॉल का अनुरोध करें",
    sending: "भेज रहे हैं...",
    sendError: "भेज नहीं सके। कृपया फिर से कोशिश करें।",
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
    disclaimer:
      "ये शुरुआती सुझाव हैं। अंतिम पात्रता प्रशिक्षण प्रदाता से सत्यापित करें।",
  },

  mr: {
    title: "तुमचा मार्ग शोधा",
    subtitle: "उपजीविकेच्या संधी आणि कौशल्य विकासाचे मार्ग जाणून घ्या.",
    start: "सुरू करा",
    done: "धन्यवाद!",
    restart: "पुन्हा सुरू करा",
    question: "प्रश्न",
    listen: "🔊 ऐका",
    speak: "🎤 बोलून उत्तर द्या",
    listening: "ऐकत आहे...",
    notUnderstood: "माफ करा, समजले नाही. कृपया बटण दाबा.",
    talk: "समुपदेशकाशी बोला",
    phoneLabel: "तुमचा मोबाईल नंबर",
    send: "कॉलची विनंती करा",
    sending: "पाठवत आहे...",
    sendError: "पाठवता आले नाही. कृपया पुन्हा प्रयत्न करा.",
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
    disclaimer:
      "या प्राथमिक सूचना आहेत. अंतिम पात्रता प्रशिक्षण संस्थेकडून तपासून घ्या.",
  },
};

// Eligibility text, by language
const elig = {
  en: {
    status: {
      match: "Potential entry-route match",
      not_established: "Entry criteria not established",
      verify: "Needs verification",
    },
    message: {
      match:
        "Your answers match a listed entry route. Your original certificates, experience documents and other requirements must be verified by the training provider.",
      tenth_not_established:
        "The currently configured 10th-pass routes require 3 years of experience or an accepted technical certificate, where applicable.",
      twelfth_verify:
        "The configured 12th-pass route specifies no experience. Please ask a counsellor to verify your situation.",
      other_verify:
        "Your answers do not establish a configured entry route. A counsellor can review other qualification pathways.",
    },
    route: {
      twelfth: "12th pass with no experience",
      tenthCert: "10th pass with NTC/NAC/CITS",
      tenthExp: "10th pass with 3 years of experience",
      other: "Other entry route",
    },
  },

  hi: {
    status: {
      match: "संभावित प्रवेश मार्ग से मेल",
      not_established: "प्रवेश की शर्तें तय नहीं",
      verify: "जाँच ज़रूरी",
    },
    message: {
      match:
        "आपके जवाब एक सूचीबद्ध प्रवेश मार्ग से मेल खाते हैं। आपके मूल प्रमाणपत्र, अनुभव के दस्तावेज़ और अन्य शर्तें प्रशिक्षण प्रदाता द्वारा जाँची जाएँगी।",
      tenth_not_established:
        "फ़िलहाल जोड़े गए 10वीं पास के मार्गों के लिए 3 साल का अनुभव या मान्य तकनीकी प्रमाणपत्र (जहाँ लागू हो) ज़रूरी है।",
      twelfth_verify:
        "12वीं पास का जोड़ा गया मार्ग बिना अनुभव वालों के लिए है। कृपया काउंसलर से अपनी स्थिति जँचवाएँ।",
      other_verify:
        "आपके जवाबों से कोई जोड़ा गया प्रवेश मार्ग तय नहीं होता। काउंसलर दूसरे योग्यता मार्ग देख सकते हैं।",
    },
    route: {
      twelfth: "12वीं पास, बिना अनुभव",
      tenthCert: "10वीं पास, NTC/NAC/CITS के साथ",
      tenthExp: "10वीं पास, 3 साल के अनुभव के साथ",
      other: "अन्य प्रवेश मार्ग",
    },
  },

  mr: {
    status: {
      match: "संभाव्य प्रवेश मार्गाशी जुळते",
      not_established: "प्रवेशाच्या अटी निश्चित नाहीत",
      verify: "तपासणी आवश्यक",
    },
    message: {
      match:
        "तुमची उत्तरे सूचीतील एका प्रवेश मार्गाशी जुळतात. तुमची मूळ प्रमाणपत्रे, अनुभवाची कागदपत्रे आणि इतर अटी प्रशिक्षण संस्थेकडून तपासल्या जातील.",
      tenth_not_established:
        "सध्या नोंदवलेल्या 10वी उत्तीर्णांच्या मार्गांसाठी 3 वर्षांचा अनुभव किंवा मान्य तांत्रिक प्रमाणपत्र (जिथे लागू असेल तिथे) आवश्यक आहे.",
      twelfth_verify:
        "12वी उत्तीर्णांसाठी नोंदवलेला मार्ग अनुभव नसलेल्यांसाठी आहे. कृपया समुपदेशकाकडून तुमची स्थिती तपासून घ्या.",
      other_verify:
        "तुमच्या उत्तरांवरून कोणताही नोंदवलेला प्रवेश मार्ग निश्चित होत नाही. समुपदेशक इतर पात्रता मार्ग पाहू शकतात.",
    },
    route: {
      twelfth: "12वी उत्तीर्ण, अनुभवाशिवाय",
      tenthCert: "10वी उत्तीर्ण, NTC/NAC/CITS सह",
      tenthExp: "10वी उत्तीर्ण, 3 वर्षांच्या अनुभवासह",
      other: "इतर प्रवेश मार्ग",
    },
  },
};

function routeLabel(route, lang) {
  const r = elig[lang].route;

  if (route.education === "12th") return r.twelfth;

  if (route.education === "10th" && route.certificate === "yes") {
    return r.tenthCert;
  }

  if (route.education === "10th" && route.experience === "3_or_more") {
    return r.tenthExp;
  }

  return r.other;
}

const suggestedTitle = {
  en: "Paths that may suit you",
  hi: "आपके लिए ये रास्ते अच्छे हो सकते हैं",
  mr: "तुमच्यासाठी हे मार्ग योग्य असू शकतात",
};

const css = `
.disha-app { font-size: 18px; line-height: 1.5; color: #111827; }
.disha-app *, .disha-app *::before, .disha-app *::after { box-sizing: border-box; }
.disha-app h1 { font-size: 28px; margin: 8px 0 12px; line-height: 1.25; }
.disha-app h2 { font-size: 22px; margin: 28px 0 12px; line-height: 1.3; }
.disha-app h3 { font-size: 20px; margin: 0 0 10px; line-height: 1.3; }
.disha-app button, .disha-app input { font-family: inherit; }
.disha-app a { color: #1d4ed8; }
.disha-app button:focus-visible,
.disha-app a:focus-visible,
.disha-app input:focus-visible,
.disha-app summary:focus-visible { outline: 3px solid #f59e0b; outline-offset: 2px; }
.disha-lang-row { display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; margin-bottom: 24px; }
.disha-lang-btn { flex: 1 1 90px; max-width: 140px; min-height: 48px; font-size: 18px;
  border-radius: 10px; border: 2px solid #2563eb; background: #fff; color: #2563eb; cursor: pointer; }
.disha-lang-btn.active { background: #2563eb; color: #fff; }
.disha-btn { display: block; width: 100%; max-width: 380px; margin: 12px auto; min-height: 56px;
  font-size: 20px; padding: 12px 20px; border-radius: 12px; cursor: pointer; }
.disha-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.disha-btn.primary { background: #2563eb; color: #fff; border: 2px solid #2563eb; }
.disha-btn.secondary { background: #fff; color: #1d4ed8; border: 2px solid #2563eb; }
.disha-btn.option { background: #fff; color: #111827; border: 2px solid #cbd5e1; }
.disha-btn.option:active { background: #e0e7ff; border-color: #2563eb; }
.disha-card { background: #fff; border-radius: 14px; padding: 18px; margin: 14px auto;
  width: 100%; max-width: 480px; text-align: left; box-shadow: 0 3px 12px rgba(0,0,0,0.08);
  overflow-wrap: anywhere; }
.disha-card p { margin: 8px 0; }
.disha-badge { display: inline-block; padding: 4px 12px; border-radius: 999px; font-size: 15px; font-weight: bold; }
.disha-badge.ok { background: #dcfce7; color: #166534; }
.disha-badge.warn { background: #fef3c7; color: #92400e; }
.disha-input { display: block; width: 100%; font-size: 22px; padding: 12px; margin: 12px 0;
  border-radius: 10px; border: 2px solid #cbd5e1; }
.disha-error { color: #b91c1c; }
@media (max-width: 480px) {
  .disha-app h1 { font-size: 24px; }
  .disha-app h2 { font-size: 20px; }
}
`;

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
      // Step 1: Save callback request in Firestore
      await addDoc(collection(db, "escalations"), {
        phone,
        language: lang,
        answers,
        status: "new",
        createdAt: serverTimestamp(),
      });

      // Step 2: Send notification email through Vercel API
      try {
        const response = await fetch("/api/notify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone,
            language: lang,
            answers,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Email notification failed:", errorText);
        } else {
          const result = await response.json();
          console.log("Email notification result:", result);
        }
      } catch (emailError) {
        console.error("Email API error:", emailError);
      }

      // Callback is saved even if email notification fails
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
      window.scrollTo(0, 0);
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
    window.scrollTo(0, 0);
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
      className="disha-app"
      style={{
        padding: "20px 16px 40px",
        textAlign: "center",
        minHeight: "100vh",
        background: "#f4f7fb",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <style>{css}</style>

      {/* Language selection */}
      <div className="disha-lang-row">
        <button
          className={`disha-lang-btn ${lang === "en" ? "active" : ""}`}
          onClick={() => setLang("en")}
        >
          English
        </button>

        <button
          className={`disha-lang-btn ${lang === "hi" ? "active" : ""}`}
          onClick={() => setLang("hi")}
        >
          हिंदी
        </button>

        <button
          className={`disha-lang-btn ${lang === "mr" ? "active" : ""}`}
          onClick={() => setLang("mr")}
        >
          मराठी
        </button>
      </div>

      {/* Home screen */}
      {screen === "home" && (
        <>
          <h1>{ui[lang].title}</h1>

          <p style={{ maxWidth: 420, margin: "0 auto 20px" }}>
            {ui[lang].subtitle}
          </p>

          <button
            className="disha-btn primary"
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
              maxWidth: 380,
              height: 10,
              background: "#ddd",
              borderRadius: 10,
              margin: "12px auto 24px",
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

          <h2 style={{ marginTop: 0 }}>{q.text[lang]}</h2>

          <button
            className="disha-btn secondary"
            onClick={() => speak(q.text[lang], lang)}
          >
            {ui[lang].listen}
          </button>

          <button
            className="disha-btn secondary"
            onClick={handleVoice}
            disabled={listening}
          >
            {listening ? ui[lang].listening : ui[lang].speak}
          </button>

          {message && <p className="disha-error">{message}</p>}

          {q.options.map((opt) => (
            <button
              key={opt.value}
              className="disha-btn option"
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

          <p style={{ fontWeight: "bold" }}>{suggestedTitle[lang]}</p>

          {/* Livelihood recommendations */}
          <h2>{ui[lang].tradesTitle}</h2>

          {tradeRecommendations.length > 0 ? (
            tradeRecommendations.map((trade) => (
              <div key={trade.id} className="disha-card">
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
              <div key={qualification.id} className="disha-card">
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

                <p>
                  <span
                    className={`disha-badge ${
                      qualification.eligibilityStatus === "match"
                        ? "ok"
                        : "warn"
                    }`}
                  >
                    {elig[lang].status[qualification.eligibilityStatus]}
                  </span>
                </p>

                <p>{elig[lang].message[qualification.eligibilityKey]}</p>

                {qualification.matchedRoute && (
                  <p>
                    <strong>{ui[lang].matchedRoute}:</strong>{" "}
                    {routeLabel(qualification.matchedRoute, lang)}
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

                <p style={{ fontSize: 14, color: "#555" }}>
                  {qualification.recommendationNote[lang] ||
                    qualification.recommendationNote.en}
                </p>
              </div>
            ))
          ) : (
            <p>No NSQF qualifications available yet.</p>
          )}

          <p
            style={{
              maxWidth: 480,
              margin: "20px auto",
              color: "#555",
              fontSize: 15,
            }}
          >
            {ui[lang].disclaimer}
          </p>

          {/* Family decision-support */}
          <div style={{ maxWidth: 480, margin: "0 auto" }}>
            <FamilyGuide
              qualifications={qualificationRecommendations}
              lang={lang}
            />
          </div>

          <p>{saveStatus}</p>

          {/* Counsellor callback */}
          <div className="disha-card">
            <h3>{ui[lang].talk}</h3>

            {callStatus === "sent" ? (
              <p>{ui[lang].sent}</p>
            ) : (
              <>
                <label htmlFor="disha-phone">
                  {ui[lang].phoneLabel}
                </label>

                <input
                  id="disha-phone"
                  className="disha-input"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value.replace(/\D/g, ""));
                    setCallStatus("");
                  }}
                />

                {callStatus === "bad" && (
                  <p className="disha-error">
                    {ui[lang].badPhone}
                  </p>
                )}

                {callStatus === "error" && (
                  <p className="disha-error">
                    {ui[lang].sendError}
                  </p>
                )}

                <button
                  className="disha-btn primary"
                  onClick={requestCall}
                  disabled={sendingCall}
                >
                  {sendingCall ? ui[lang].sending : ui[lang].send}
                </button>
              </>
            )}
          </div>

          <button className="disha-btn secondary" onClick={restart}>
            {ui[lang].restart}
          </button>
        </>
      )}
    </div>
  );
}
