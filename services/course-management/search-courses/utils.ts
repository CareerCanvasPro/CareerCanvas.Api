export const extractDurations = ({
  durations,
}: {
  durations: string[];
}): number[][] =>
  durations.map((duration) =>
    duration.split("-").map((value) => parseFloat(value))
  );

export const splitKeyword = ({
  keyword,
}: {
  keyword: string;
}): { keywords: string[] } => {
  const keywords = keyword.split(" ");

  return { keywords };
};
