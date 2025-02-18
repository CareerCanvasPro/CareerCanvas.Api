/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const computeMBTI = ({ questions, result }) => {
  const mbti = {
    E: 0,
    F: 0,
    I: 0,
    J: 0,
    N: 0,
    P: 0,
    S: 0,
    T: 0,
  };

  for (const { answer, questionID } of result) {
    const question = questions.find(
      (question) => question.questionID === questionID
    );

    if (question) {
      const score = answer * question.score;

      switch (question.category) {
        case "EI":
          if (score >= 0) {
            mbti.E += score;
          } else {
            mbti.I -= score;
          }

          break;
        case "SN":
          if (score >= 0) {
            mbti.S += score;
          } else {
            mbti.N -= score;
          }

          break;
        case "TF":
          if (score >= 0) {
            mbti.T += score;
          } else {
            mbti.F -= score;
          }

          break;
        case "JP":
          if (score >= 0) {
            mbti.J += score;
          } else {
            mbti.P -= score;
          }

          break;
      }
    }
  }

  const personalityTestResult = {
    EI: mbti.E / (mbti.E + mbti.I),
    JP: mbti.J / (mbti.J + mbti.P),
    SN: mbti.S / (mbti.S + mbti.N),
    TF: mbti.T / (mbti.T + mbti.F),
  };

  const EI = mbti.E >= mbti.I ? "E" : "I";

  const SN = mbti.S >= mbti.N ? "S" : "N";

  const TF = mbti.T >= mbti.F ? "T" : "F";

  const JP = mbti.J >= mbti.P ? "J" : "P";

  const personalityType = `${EI}${SN}${TF}${JP}`;

  return { personalityTestResult, personalityType };
};
