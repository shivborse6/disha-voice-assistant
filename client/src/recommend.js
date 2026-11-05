import { trades } from "./trades";

const eduRank = { "8th_or_below": 0, "10th": 1, "12th": 2, graduate: 3 };

export function recommend(answers) {
  return trades
    .filter((t) => eduRank[answers.education] >= eduRank[t.minEducation])
    .map((t) => {
      let score = 0;
      if (t.mode === "both" || t.mode === answers.preference) score += 2;
      if (t.relatedWork.includes(answers.work)) score += 1;
      return { ...t, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}