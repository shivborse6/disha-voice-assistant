export const trades = [
  {
    id: "electrician",
    name: { en: "Electrician", hi: "इलेक्ट्रीशियन", mr: "इलेक्ट्रिशियन" },
    summary: {
      en: "Learn wiring and repair work for homes and factories.",
      hi: "घरों और फैक्ट्रियों में वायरिंग और मरम्मत का काम सीखें।",
      mr: "घरे आणि कारखान्यांमध्ये वायरिंग व दुरुस्तीचे काम शिका.",
    },
    minEducation: "10th",
    mode: "both",
    relatedWork: ["labour", "none"],
  },
  {
    id: "welder",
    name: { en: "Welder", hi: "वेल्डर", mr: "वेल्डर" },
    summary: {
      en: "Learn to join and cut metal for construction and fabrication.",
      hi: "निर्माण और फैब्रिकेशन के लिए धातु जोड़ना और काटना सीखें।",
      mr: "बांधकाम आणि फॅब्रिकेशनसाठी धातू जोडणे व कापणे शिका.",
    },
    minEducation: "8th_or_below",
    mode: "both",
    relatedWork: ["labour"],
  },
  {
    id: "tailoring",
    name: { en: "Tailoring", hi: "सिलाई", mr: "शिवणकाम" },
    summary: {
      en: "Learn stitching and garment making to work or start your own shop.",
      hi: "सिलाई और कपड़े बनाना सीखें, नौकरी या अपनी दुकान शुरू करें।",
      mr: "शिवणकाम शिका आणि नोकरी किंवा स्वतःचे दुकान सुरू करा.",
    },
    minEducation: "8th_or_below",
    mode: "own",
    relatedWork: ["shop", "none"],
  },
  {
    id: "mobile_repair",
    name: { en: "Mobile repair", hi: "मोबाइल रिपेयर", mr: "मोबाईल दुरुस्ती" },
    summary: {
      en: "Learn to repair phones, a common local business.",
      hi: "फोन की मरम्मत सीखें, एक आम स्थानीय व्यवसाय।",
      mr: "मोबाईल दुरुस्ती शिका, एक सामान्य स्थानिक व्यवसाय.",
    },
    minEducation: "10th",
    mode: "own",
    relatedWork: ["shop", "none"],
  },
  {
    id: "solar",
    name: { en: "Solar technician", hi: "सोलर टेक्नीशियन", mr: "सोलर तंत्रज्ञ" },
    summary: {
      en: "Learn to install and maintain solar panels.",
      hi: "सोलर पैनल लगाना और उनकी देखभाल करना सीखें।",
      mr: "सोलर पॅनेल बसवणे आणि देखभाल करणे शिका.",
    },
    minEducation: "10th",
    mode: "job",
    relatedWork: ["labour", "farming"],
  },
  {
    id: "dairy",
    name: { en: "Dairy farming", hi: "डेयरी फार्मिंग", mr: "दुग्ध व्यवसाय" },
    summary: {
      en: "Learn modern dairy farming and run a small milk business.",
      hi: "आधुनिक डेयरी फार्मिंग सीखें और छोटा दूध व्यवसाय चलाएँ।",
      mr: "आधुनिक दुग्ध व्यवसाय शिका आणि छोटा दुधाचा व्यवसाय चालवा.",
    },
    minEducation: "8th_or_below",
    mode: "own",
    relatedWork: ["farming"],
  },
];