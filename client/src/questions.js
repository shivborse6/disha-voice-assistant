
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
    id: "experience",
    text: {
      en: "How many years of work experience do you have?",
      hi: "आपके पास कितने साल का काम का अनुभव है?",
      mr: "तुमच्याकडे किती वर्षांचा कामाचा अनुभव आहे?",
    },
    options: [
      { value: "none", label: { en: "No experience", hi: "कोई अनुभव नहीं", mr: "अनुभव नाही" } },
      { value: "below_1", label: { en: "Less than 1 year", hi: "1 साल से कम", mr: "१ वर्षापेक्षा कमी" } },
      { value: "1_to_2", label: { en: "1–2 years", hi: "1–2 साल", mr: "१–२ वर्षे" } },
      { value: "3_or_more", label: { en: "3 or more years", hi: "3 साल या अधिक", mr: "३ किंवा अधिक वर्षे" } },
    ],
  },

  {
    id: "certificate",
    text: {
      en: "Do you have an ITI, NTC, NAC or CITS certificate?",
      hi: "क्या आपके पास ITI, NTC, NAC या CITS प्रमाणपत्र है?",
      mr: "तुमच्याकडे ITI, NTC, NAC किंवा CITS प्रमाणपत्र आहे का?",
    },
    options: [
      { value: "yes", label: { en: "Yes", hi: "हाँ", mr: "होय" } },
      { value: "no", label: { en: "No", hi: "नहीं", mr: "नाही" } },
      { value: "unsure", label: { en: "Not sure", hi: "पता नहीं", mr: "माहित नाही" } },
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
