import { trades } from "./trades";
import { qualifications } from "./qualifications";

const eduRank = {
  "8th_or_below": 0,
  "10th": 1,
  "12th": 2,
  graduate: 3,
};

// Existing livelihood recommendations
export function recommend(answers) {
  return trades
    .filter(
      (t) => eduRank[answers.education] >= eduRank[t.minEducation]
    )
    .map((t) => {
      let score = 0;

      if (t.mode === "both" || t.mode === answers.preference) {
        score += 2;
      }

      if (t.relatedWork.includes(answers.work)) {
        score += 1;
      }

      return { ...t, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

// Assess a qualification's configured entry routes.
// Returns language-neutral codes; the screen picks the text for the chosen language.
//   status: "match" | "not_established" | "verify"
//   key: "match" | "tenth_not_established" | "twelfth_verify" | "other_verify"
function assessEligibility(answers, qualification) {
  const routes = qualification.eligibilityRoutes || [];

  for (const route of routes) {
    if (answers.education !== route.education) {
      continue;
    }

    if (route.experience && answers.experience !== route.experience) {
      continue;
    }

    if (route.certificate && answers.certificate !== route.certificate) {
      continue;
    }

    return { status: "match", key: "match", matchedRoute: route };
  }

  if (
    answers.education === "10th" &&
    answers.experience !== "3_or_more" &&
    answers.certificate !== "yes"
  ) {
    return {
      status: "not_established",
      key: "tenth_not_established",
      matchedRoute: null,
    };
  }

  if (answers.education === "12th" && answers.experience !== "none") {
    return { status: "verify", key: "twelfth_verify", matchedRoute: null };
  }

  return { status: "verify", key: "other_verify", matchedRoute: null };
}

// NSQF qualification recommendations
export function recommendQualifications(answers) {
  return qualifications
    .map((qualification) => {
      let score = 0;

      // Education relevance
      if (answers.education === "12th" || answers.education === "graduate") {
        score += 3;
      } else if (answers.education === "10th") {
        score += 2;
      }

      // Career preference
      if (answers.preference === "own") {
        score += 2;
      } else if (answers.preference === "job") {
        score += 1;
      }

      // Sector relevance
      if (
        qualification.id === "livestock-service-provider" &&
        answers.work === "farming"
      ) {
        score += 3;
      }

      if (
        qualification.id === "agriculture-field-officer" &&
        answers.work === "farming"
      ) {
        score += 3;
      }

      if (
        qualification.id === "solar-pv-installer-electrical" &&
        answers.work === "labour"
      ) {
        score += 1;
      }

      const eligibility = assessEligibility(answers, qualification);

      return {
        ...qualification,
        score,
        eligibilityStatus: eligibility.status,
        eligibilityKey: eligibility.key,
        matchedRoute: eligibility.matchedRoute,
      };
    })
    .sort((a, b) => b.score - a.score);
}