// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const computeMBTI = ({ questions, result }) => {
  const mbti = {
    EI: 0,
    JP: 0,
    SN: 0,
    TF: 0,
  };

  for (const { answer, questionID } of result) {
    for (const question of questions) {
      if (question.questionID === questionID) {
        switch (question.category) {
          case "EI":
            mbti.EI += answer * question.score;
            break;
          case "SN":
            mbti.SN += answer * question.score;
            break;
          case "TF":
            mbti.TF += answer * question.score;
            break;
          case "JP":
            mbti.JP += answer * question.score;
            break;
        }
      }
    }
  }

  const EI = mbti.EI >= 0 ? "E" : "I";
  const SN = mbti.SN >= 0 ? "S" : "N";
  const TF = mbti.TF >= 0 ? "T" : "F";
  const JP = mbti.JP >= 0 ? "J" : "P";

  const personalityTestResult = `${EI}${SN}${TF}${JP}`;

  return { personalityTestResult };
};
