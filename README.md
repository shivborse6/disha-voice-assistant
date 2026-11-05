# Disha — Voice-First Livelihood Assistant

A multilingual (English, Hindi, Marathi) voice-first web app that interviews a person about their education, work and preferences, then suggests skilling and livelihood paths.

**Live demo:** https://disha-voice-assistant.vercel.app

Inspired by Smart India Hackathon 2026 problem statement SIH26097 (AI-driven voice assistant for livelihood mapping and NSQF-aligned skilling recommendations). This is a personal learning project, not an official SIH submission.

## Features
- Three-language interface with a language toggle
- Short interview, one question at a time, with large buttons
- Questions read aloud (browser text-to-speech)
- Answer by voice (browser speech recognition) or by tapping
- Suggests the top 3 trades based on the answers
- Saves each completed interview to Firebase Firestore
- "Talk to a counsellor" callback request (demo)

## Tech stack
React (Vite), Firebase Firestore, Web Speech API, deployed on Vercel.

## Run locally
1. Clone the repo and open the `client` folder
2. Run `npm install`
3. Create a `client/.env` file with your own Firebase web app keys:
   ```
   VITE_FIREBASE_API_KEY=
   VITE_FIREBASE_AUTH_DOMAIN=
   VITE_FIREBASE_PROJECT_ID=
   VITE_FIREBASE_STORAGE_BUCKET=
   VITE_FIREBASE_MESSAGING_SENDER_ID=
   VITE_FIREBASE_APP_ID=
   ```
4. Run `npm run dev`

## Privacy
Interview answers are stored without names. If a user requests a callback, their mobile number is stored along with their answers. Firestore security rules allow creating these records but not reading them from the public site. This is a demo, so please use test numbers only.

## Limitations
- Trade data is a small illustrative sample, not verified placement or salary data
- Speech support depends on the browser and device; Marathi voice may be unreliable
- Recommendations use simple rules, not AI yet
- Counsellor callback is a demo: requests are stored in Firestore but no one is notified

## Roadmap
- [ ] Verified outcome data (sourced from NSDC / ITI pages)
- [ ] AI explanations grounded in that data
- [ ] More questions and trades
- [ ] Admin dashboard
- [ ] WhatsApp / IVR channel demo