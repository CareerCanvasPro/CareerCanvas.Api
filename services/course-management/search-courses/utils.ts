export const extractDurations = ({
  durations,
}: {
  durations: string[];
}): number[][] =>
  durations.map((duration) =>
    duration.split("-").map((value) => parseFloat(value))
  );
