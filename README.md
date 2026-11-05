# Disha — Voice-First Livelihood Assistant

A multilingual (English, Hindi, Marathi) voice-first web app that interviews a person about their education, work and preferences, then suggests livelihood paths and NSQF-aligned qualifications, with a guide to help the whole family understand the options.

**Live demo:** https://disha-voice-assistant.vercel.app

Inspired by Smart India Hackathon 2026 problem statement SIH26097 (AI-driven voice assistant for livelihood mapping and NSQF-aligned skilling recommendations). This is a personal learning project, not an official SIH submission.

## Features
- Three-language interface (English, Hindi, Marathi) with a language toggle
- Five-question interview, one question at a time, with large buttons: education, current work, experience, technical certificate, career preference
- Questions read aloud (browser text-to-speech)
- Answer by voice (browser speech recognition) or by tapping
- Suggests the top 3 livelihood trades based on the answers
- NSQF qualification cards with level, duration, matched entry route and a link to the official National Qualification Register (NQR) record
- Preliminary eligibility check against entry routes that have been configured for each qualification
- "For parents and family" guide: training duration, skills, next step and a parents' FAQ in all three languages
- "Talk to a counsellor" callback request (demo)
- Admin dashboard with Google sign-in: total interviews, callback requests, and charts by language, education, occupation and preference, plus recent records

## Tech stack
React (Vite), Firebase Firestore, Firebase Authentication, Recharts, Web Speech API, deployed on Vercel.

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
5. The admin dashboard is at `/#admin` (it needs Google sign-in enabled in your Firebase project and your own admin email in the Firestore rules)

## Data sources
Qualification details (NSQF level, duration, entry routes, progression and validity) are taken from the official [National Qualification Register](https://www.nqr.gov.in). Each card links to its source record. Currently included:
- Solar PV Installer – Electrical
- Livestock Service Provider
- Agriculture Field Officer
- Integrated Farming Practitioner

## Privacy
Interview answers are stored without names. If a user requests a callback, their mobile number is stored along with their answers. Firestore security rules allow only validated records to be created from the public site, and only the admin account can read them. This is a demo, so please use test numbers only.

## Limitations
- Recommendations use simple rules, not AI yet
- Only four NSQF qualifications are included so far, and eligibility is checked only against the entry routes configured for them. Results are preliminary and must be verified with a training provider
- The livelihood trade data is a small illustrative sample, not verified placement or salary data
- The family guide does not include fees, placement or degree-equivalence information, because these are not in the official records
- Speech support depends on the browser and device; Marathi voice may be unreliable
- Counsellor callback is a demo: requests are stored in Firestore but no one is notified
- Public write access is limited by validation rules, but there is no App Check or rate limiting yet

## Roadmap
- [x] Multilingual voice interview
- [x] NSQF qualification cards with official NQR links
- [x] Admin dashboard
- [x] Family decision-support guide
- [ ] More verified qualifications across sectors
- [ ] Mobile and accessibility improvements
- [ ] Real counsellor notifications (email/SMS)
- [ ] AI explanations grounded in verified data
- [ ] Firebase App Check and rate limiting
- [ ] WhatsApp / IVR channel demo