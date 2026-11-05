export const questions = [
  {
    id: "education",
    text: {
      en: "How much have you studied?",
      hi: "आपकी पढ़ाई कितनी हुई है?",
      mr: "तुमचे शिक्षण किती झाले आहे?",
    },
    options: [
      { value: "8th_or_below", label: { en: "8th or below", hi: "8वीं या कम", mr: "८वी किंवा कमी" } },
      { value: "10th", label: { en: "10th pass", hi: "10वीं पास", mr: "१०वी पास" } },
      { value: "12th", label: { en: "12th pass", hi: "12वीं पास", mr: "१२वी पास" } },
      { value: "graduate", label: { en: "Graduate", hi: "ग्रेजुएट", mr: "पदवीधर" } },
    ],
  },
  {
    id: "work",
    text: {
      en: "What work do you do now?",
      hi: "आप अभी क्या काम करते हैं?",
      mr: "तुम्ही सध्या कोणते काम करता?",
    },
    options: [
      { value: "farming", label: { en: "Farming", hi: "खेती", mr: "शेती" } },
      { value: "labour", label: { en: "Labour work", hi: "मज़दूरी", mr: "मजुरी" } },
      { value: "shop", label: { en: "Small shop or business", hi: "छोटी दुकान / व्यवसाय", mr: "छोटे दुकान / व्यवसाय" } },
      { value: "none", label: { en: "No work right now", hi: "अभी कोई काम नहीं", mr: "सध्या काम नाही" } },
    ],
  },
  {
    id: "preference",
    text: {
      en: "What would you prefer?",
      hi: "आप क्या पसंद करेंगे?",
      mr: "तुम्हाला काय आवडेल?",
    },
    options: [
      { value: "job", label: { en: "A job with salary", hi: "वेतन वाली नौकरी", mr: "पगार असलेली नोकरी" } },
      { value: "own", label: { en: "My own business", hi: "अपना काम / व्यवसाय", mr: "स्वतःचा व्यवसाय" } },
    ],
  },
];