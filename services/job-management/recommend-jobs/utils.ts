import { Job } from "@prisma/client";

export const generateKeywords = ({
  string,
}: {
  string: string;
}): { keywords: string[] } => {
  const keywords = string.split(/, |,| /);

  return { keywords };
};

export const shuffleJobs = ({
  jobs,
}: {
  jobs: Job[];
}): {
  shuffledJobs: Job[];
} => {
  const shuffledJobs = [...jobs];

  for (let i = shuffledJobs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffledJobs[i], shuffledJobs[j]] = [shuffledJobs[j], shuffledJobs[i]];
  }

  return { shuffledJobs };
};
