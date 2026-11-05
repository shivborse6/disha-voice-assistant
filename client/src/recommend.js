
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

// Assess a qualification's currently configured entry routes
function assessEligibility(answers, qualification) {
  const routes = qualification.eligibilityRoutes || [];

  for (const route of routes) {
    // Check education
    if (answers.education !== route.education) {
      continue;
    }

    // Check experience if required
    if (
      route.experience &&
      answers.experience !== route.experience
    ) {
      continue;
    }

    // Check certificate if required
    if (
      route.certificate &&
      answers.certificate !== route.certificate
    ) {
      continue;
    }

    return {
      status: "Potential entry-route match",
      message:
        "Your answers match a listed entry route. Your original certificates, experience documents and other requirements must be verified by the training provider.",
      matchedRoute: route,
    };
  }

  // Explain why no route was matched
  if (
    answers.education === "10th" &&
    answers.experience !== "3_or_more" &&
    answers.certificate !== "yes"
  ) {
    return {
      status: "Entry criteria not established",
      message:
        "The currently configured 10th-pass routes require 3 years of experience or an accepted technical certificate, where applicable.",
      matchedRoute: null,
    };
  }

  if (
    answers.education === "12th" &&
    answers.experience !== "none"
  ) {
    return {
      status: "Needs verification",
      message:
        "The configured 12th-pass route specifies no experience. Please ask a counsellor to verify your situation.",
      matchedRoute: null,
    };
  }

  return {
    status: "Needs verification",
    message:
      "Your answers do not establish a configured entry route. A counsellor can review other qualification pathways.",
    matchedRoute: null,
  };
}

// NSQF qualification recommendations
export function recommendQualifications(answers) {
  return qualifications
    .map((qualification) => {
      let score = 0;

      // Education relevance
      if (
        answers.education === "12th" ||
        answers.education === "graduate"
      ) {
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

      const eligibility = assessEligibility(
        answers,
        qualification
      );

      return {
        ...qualification,
        score,
        eligibilityStatus: eligibility.status,
        eligibilityMessage: eligibility.message,
        matchedRoute: eligibility.matchedRoute,
      };
    })
    .sort((a, b) => b.score - a.score);
}
