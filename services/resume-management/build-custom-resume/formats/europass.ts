import PDFDocument from "pdfkit-table";

import { CustomResume } from "../resumes.db.service";

export const buildEuropassFormatResume = async ({
  customResume,
}: {
  customResume: CustomResume;
}): Promise<Buffer<ArrayBuffer>> => {
  const chunks: Buffer[] = [];

  const doc = new PDFDocument({
    margin: 50,
    size: "A4",
  }).on("data", (chunk) => chunks.push(chunk));

  doc
    .fillColor("#1171BA")
    .font("Helvetica")
    .fontSize(12)
    .text("PERSONAL INFORMATION", {
      align: "left",
      width: 100,
    });

  doc
    .lineWidth(1)
    .strokeColor("#1171BA")
    .moveTo(doc.page.margins.left, doc.y)
    .lineTo(doc.page.width - doc.page.margins.right, doc.y)
    .stroke()
    .moveDown();

  const response = await fetch(
    customResume.profilePicture ? customResume.profilePicture : ""
  );

  const arrayBuffer = await response.arrayBuffer();

  const buffer = Buffer.from(arrayBuffer);

  doc.image(buffer, doc.page.margins.left, doc.y, {
    height: 100,
    width: 100,
  });

  doc.fillColor("black").font("Helvetica-Bold").text("Name: ", {
    align: "left",
    continued: true,
    indent: 120,
    indentAllLines: true,
  });

  doc.font("Helvetica").text(customResume.name, {
    align: "left",
  });

  doc.font("Helvetica-Bold").text("Address: ", {
    align: "left",
    continued: true,
    indent: 120,
    indentAllLines: true,
  });

  doc.font("Helvetica").text(customResume.address ? customResume.address : "", {
    align: "left",
  });

  doc.font("Helvetica-Bold").text("Telephone: ", {
    align: "left",
    continued: true,
    indent: 120,
    indentAllLines: true,
  });

  doc
    .font("Helvetica")
    .text(customResume.telephone ? customResume.telephone : "", {
      align: "left",
    });

  doc.font("Helvetica-Bold").text("Mobile: ", {
    align: "left",
    continued: true,
    indent: 120,
    indentAllLines: true,
  });

  doc.font("Helvetica").text(customResume.mobile, {
    align: "left",
  });

  doc.font("Helvetica-Bold").text("Email: ", {
    align: "left",
    continued: true,
    indent: 120,
    indentAllLines: true,
  });

  doc.font("Helvetica").text(customResume.email, {
    align: "left",
  });

  doc.font("Helvetica-Bold").text("Website: ", {
    align: "left",
    continued: true,
    indent: 120,
    indentAllLines: true,
  });

  doc.font("Helvetica").text(customResume.website ? customResume.website : "", {
    align: "left",
  });

  doc.font("Helvetica-Bold").text("Sex: ", {
    align: "left",
    continued: true,
    indent: 120,
    indentAllLines: true,
  });

  doc.font("Helvetica").text(customResume.sex ? customResume.sex : "", {
    align: "left",
  });

  doc.font("Helvetica-Bold").text("Date of Birth: ", {
    align: "left",
    continued: true,
    indent: 120,
    indentAllLines: true,
  });

  doc
    .font("Helvetica")
    .text(
      new Intl.DateTimeFormat("en-GB").format(
        new Date(customResume.dateOfBirth ? customResume.dateOfBirth : 0)
      ),
      {
        align: "left",
      }
    );

  doc.font("Helvetica-Bold").text("Nationality: ", {
    align: "left",
    continued: true,
    indent: 120,
    indentAllLines: true,
  });

  doc
    .font("Helvetica")
    .text(customResume.nationality ? customResume.nationality : "", {
      align: "left",
    });

  if (customResume.jobAppliedFor) {
    doc
      .moveDown()
      .fillColor("#1171BA")
      .text("JOB APPLIED FOR", {
        align: "left",
        width: 100,
      })
      .moveUp();

    doc.fillColor("black").text(customResume.jobAppliedFor, {
      align: "left",
      indent: 120,
      indentAllLines: true,
    });
  }

  if (customResume.position) {
    doc
      .moveDown()
      .fillColor("#1171BA")
      .text("POSITION", {
        align: "left",
        width: 100,
      })
      .moveUp();

    doc.fillColor("black").text(customResume.position, {
      align: "left",
      indent: 120,
      indentAllLines: true,
    });
  }

  if (customResume.preferredJob) {
    doc
      .moveDown()
      .fillColor("#1171BA")
      .text("PREFERRED JOB", {
        align: "left",
        width: 100,
      })
      .moveUp();

    doc.fillColor("black").text(customResume.preferredJob, {
      align: "left",
      indent: 120,
      indentAllLines: true,
    });
  }

  if (customResume.studiesAppliedFor) {
    doc
      .moveDown()
      .fillColor("#1171BA")
      .text("STUDIES APPLIED FOR", {
        align: "left",
        width: 100,
      })
      .moveUp();

    doc.fillColor("black").text(customResume.studiesAppliedFor, {
      align: "left",
      indent: 120,
      indentAllLines: true,
    });
  }

  if (customResume.personalStatement) {
    doc
      .moveDown()
      .fillColor("#1171BA")
      .text("PERSONAL STATEMENT", {
        align: "left",
        width: 100,
      })
      .moveUp();

    doc.fillColor("black").text(customResume.personalStatement, {
      align: "left",
      indent: 120,
      indentAllLines: true,
    });
  }

  doc.moveDown(2).fillColor("#1171BA").text("PERSONAL SKILLS", {
    align: "left",
    width: 100,
  });

  doc
    .moveTo(doc.page.margins.left, doc.y)
    .lineTo(doc.page.width - doc.page.margins.right, doc.y)
    .stroke()
    .moveDown();

  doc.text("Mother Tongue", {
    align: "left",
    width: 100,
  });

  doc
    .moveUp()
    .fillColor("black")
    .text(customResume.motherTongue ? customResume.motherTongue : "", {
      align: "left",
      indent: 120,
      indentAllLines: true,
    });

  if (customResume.otherLanguages && customResume.otherLanguages.length) {
    doc
      .moveDown()
      .fillColor("#1171BA")
      .text("Other Languages", {
        align: "left",
        width: 100,
      })
      .moveUp()
      .fillColor("black")
      .fontSize(9);

    const datas = customResume.otherLanguages.map((otherLanguage) => ({
      language: otherLanguage.title,
      listening: otherLanguage.listeningLevel,
      reading: otherLanguage.readingLevel,
      spokenInteraction: otherLanguage.spokenInteractionLevel,
      spokenProduction: otherLanguage.spokenProductionLevel,
      writing: otherLanguage.writingLevel,
    }));

    const headers = [
      {
        align: "center",
        label: "Language",
        property: "language",
      },
      {
        align: "center",
        label: "Listening",
        property: "listening",
      },
      {
        align: "center",
        label: "Reading",
        property: "reading",
      },
      {
        align: "center",
        label: "Spoken Interaction",
        property: "spokenInteraction",
      },
      {
        align: "center",
        label: "Spoken Production",
        property: "spokenProduction",
      },
      {
        align: "center",
        label: "Writing",
        property: "writing",
      },
    ];

    const table = {
      datas,
      headers,
    };

    doc.table(table, {
      prepareHeader: () => doc.font("Helvetica-Bold"),
      prepareRow: () => doc.font("Helvetica"),
      width:
        doc.page.width - doc.page.margins.left - doc.page.margins.right - 120,
      x: doc.page.margins.left + 120,
      y: doc.y,
    });

    doc.x = doc.page.margins.left;
  }

  doc
    .moveDown()
    .fillColor("#1171BA")
    .fontSize(12)
    .text("Digital Competence", {
      align: "left",
      width: 100,
    })
    .moveUp()
    .fillColor("black")
    .fontSize(9);

  const datas = [
    {
      communication: customResume.communicationLevel
        ? customResume.communicationLevel
        : "",
      contentCreation: customResume.contentCreationLevel
        ? customResume.contentCreationLevel
        : "",
      informationProcessing: customResume.informationProcessingLevel
        ? customResume.informationProcessingLevel
        : "",
      problemSolving: customResume.problemSolvingLevel
        ? customResume.problemSolvingLevel
        : "",
      safety: customResume.safetyLevel ? customResume.safetyLevel : "",
    },
  ];

  const headers = [
    {
      align: "center",
      label: "Information Processing",
      property: "informationProcessing",
    },
    {
      align: "center",
      label: "Communication",
      property: "communication",
    },
    {
      align: "center",
      label: "Content Creation",
      property: "contentCreation",
    },
    {
      align: "center",
      label: "Safety",
      property: "safety",
    },
    {
      align: "center",
      label: "Problem Solving",
      property: "problemSolving",
    },
  ];

  const table = {
    datas,
    headers,
  };

  doc.table(table, {
    prepareHeader: () => doc.font("Helvetica-Bold"),
    prepareRow: () => doc.font("Helvetica"),
    width:
      doc.page.width - doc.page.margins.left - doc.page.margins.right - 120,
    x: doc.page.margins.left + 120,
    y: doc.y,
  });

  doc.x = doc.page.margins.left;

  if (
    customResume.computerCertificates &&
    customResume.computerCertificates.length
  ) {
    doc
      .moveDown()
      .fillColor("black")
      .font("Helvetica-Bold")
      .fontSize(12)
      .text("ICT Certificates", {
        align: "left",
        indent: 120,
        indentAllLines: true,
      })
      .moveDown(0.25)
      .font("Helvetica");

    doc.list(
      customResume.computerCertificates.map(
        (computerCertificate) => computerCertificate.title
      ),
      {
        align: "left",
        bulletIndent: 30,
        bulletRadius: 2,
        indent: 120,
        indentAllLines: true,
      }
    );
  }

  if (customResume.computerSkills && customResume.computerSkills.length) {
    doc
      .moveDown()
      .fillColor("black")
      .font("Helvetica-Bold")
      .fontSize(12)
      .text("ICT Skills", {
        align: "left",
        indent: 120,
        indentAllLines: true,
      })
      .moveDown(0.25)
      .font("Helvetica");

    doc.list(
      customResume.computerSkills.map((computerSkill) => computerSkill.title),
      {
        align: "left",
        bulletIndent: 30,
        bulletRadius: 2,
        indent: 120,
        indentAllLines: true,
      }
    );
  }

  if (
    customResume.communicationSkills &&
    customResume.communicationSkills.length
  ) {
    doc
      .moveDown()
      .fillColor("#1171BA")
      .fontSize(12)
      .text("Communication Skills", {
        align: "left",
        width: 100,
      })
      .moveUp()
      .fillColor("black");

    doc.list(
      customResume.communicationSkills.map(
        (communicationSkill) => communicationSkill.title
      ),
      {
        align: "left",
        bulletIndent: 30,
        bulletRadius: 2,
        indent: 120,
        indentAllLines: true,
      }
    );
  }

  if (customResume.managerialSkills && customResume.managerialSkills.length) {
    doc
      .moveDown()
      .fillColor("#1171BA")
      .fontSize(12)
      .text("Organizational / Managerial Skills", {
        align: "left",
        width: 100,
      })
      .moveUp()
      .fillColor("black");

    doc.list(
      customResume.managerialSkills.map(
        (managerialSkill) => managerialSkill.title
      ),
      {
        align: "left",
        bulletIndent: 30,
        bulletRadius: 2,
        indent: 120,
        indentAllLines: true,
      }
    );
  }

  if (customResume.jobSkills && customResume.jobSkills.length) {
    doc
      .moveDown()
      .fillColor("#1171BA")
      .fontSize(12)
      .text("Job-related Skills", {
        align: "left",
        width: 100,
      })
      .moveUp()
      .fillColor("black");

    doc.list(
      customResume.jobSkills.map((jobSkill) => jobSkill.title),
      {
        align: "left",
        bulletIndent: 30,
        bulletRadius: 2,
        indent: 120,
        indentAllLines: true,
      }
    );
  }

  if (customResume.otherSkills && customResume.otherSkills.length) {
    doc
      .moveDown()
      .fillColor("#1171BA")
      .fontSize(12)
      .text("Communication Skills", {
        align: "left",
        width: 100,
      })
      .moveUp()
      .fillColor("black");

    doc.list(
      customResume.otherSkills.map((otherSkill) => otherSkill.title),
      {
        align: "left",
        bulletIndent: 30,
        bulletRadius: 2,
        indent: 120,
        indentAllLines: true,
      }
    );
  }

  if (customResume.drivingLicenseCategory) {
    doc.moveDown().fillColor("#1171BA").fontSize(12).text("Driving Licence", {
      align: "left",
      width: 100,
    });

    doc.moveUp().fillColor("black").text(customResume.drivingLicenseCategory, {
      align: "left",
      indent: 120,
      indentAllLines: true,
    });
  }

  if (customResume.workExperiences && customResume.workExperiences.length) {
    doc.moveDown(2).fillColor("#1171BA").fontSize(12).text("WORK EXPERIENCE", {
      align: "left",
      width: 100,
    });

    doc
      .lineWidth(1)
      .strokeColor("#1171BA")
      .moveTo(doc.page.margins.left, doc.y)
      .lineTo(doc.page.width - doc.page.margins.right, doc.y)
      .stroke();

    customResume.workExperiences.forEach((workExperience) => {
      doc
        .moveDown()
        .fillColor("#1171BA")
        .text(
          `${new Date(workExperience.startDate).toLocaleString("en-US", {
            month: "short",
            year: "numeric",
          })} - ${
            workExperience.isCurrent
              ? "Present"
              : workExperience.endDate
              ? new Date(workExperience.endDate).toLocaleString("en-US", {
                  month: "short",
                  year: "numeric",
                })
              : ""
          }`,
          {
            align: "left",
            width: 100,
          }
        );

      doc
        .moveUp()
        .fillColor("black")
        .font("Helvetica-Bold")
        .text(workExperience.designation, {
          align: "left",
          indent: 120,
          indentAllLines: true,
        });

      doc
        .font("Helvetica-Oblique")
        .text(
          `${workExperience.organization}, ${workExperience.organizationLocation} (Website: ${workExperience.organizationWebsite})`,
          {
            align: "left",
            indent: 120,
            indentAllLines: true,
          }
        );

      doc
        .font("Helvetica")
        .text(workExperience.description ? workExperience.description : "", {
          align: "left",
          indent: 120,
          indentAllLines: true,
        });
    });
  }

  if (customResume.trainings && customResume.trainings.length) {
    doc.moveDown(2).fillColor("#1171BA").text("EDUCATION AND TRAINING", {
      align: "left",
      width: 100,
    });

    doc
      .lineWidth(1)
      .strokeColor("#1171BA")
      .moveTo(doc.page.margins.left, doc.y)
      .lineTo(doc.page.width - doc.page.margins.right, doc.y)
      .stroke();

    customResume.trainings.forEach((training) => {
      doc
        .moveDown()
        .fillColor("#1171BA")
        .text(
          `${new Date(training.startDate).toLocaleString("en-US", {
            month: "short",
            year: "numeric",
          })} - ${
            training.isCurrent
              ? "Present"
              : training.endDate
              ? new Date(training.endDate).toLocaleString("en-US", {
                  month: "short",
                  year: "numeric",
                })
              : ""
          }`,
          {
            align: "left",
            width: 100,
          }
        );

      doc
        .moveUp()
        .fillColor("black")
        .font("Helvetica-Bold")
        .text(training.title, {
          align: "left",
          continued: true,
          indent: 120,
          indentAllLines: true,
        });

      doc
        .fillColor("#1171BA")
        .font("Helvetica")
        .text(`EQF Level: ${training.eqfLevel}`, {
          align: "right",
        });

      doc
        .fillColor("black")
        .font("Helvetica-Oblique")
        .text(`${training.organization}, ${training.organizationLocation}`, {
          align: "left",
          indent: 120,
          indentAllLines: true,
        });

      doc
        .font("Helvetica")
        .text(training.description ? training.description : "", {
          align: "left",
          indent: 120,
          indentAllLines: true,
        });
    });
  }

  doc
    .moveDown(2)
    .fillColor("#1171BA")
    .fontSize(12)
    .text("ADDITIONAL INFORMATION", {
      align: "left",
      width: 100,
    });

  doc
    .lineWidth(1)
    .strokeColor("#1171BA")
    .moveTo(doc.page.margins.left, doc.y)
    .lineTo(doc.page.width - doc.page.margins.right, doc.y)
    .stroke();

  if (customResume.publications && customResume.publications.length) {
    doc
      .moveDown()
      .fillColor("#1171BA")
      .text("Publications", {
        align: "left",
        width: 100,
      })
      .moveUp()
      .fillColor("black");

    doc.list(
      customResume.publications.map((publication) => publication.title),
      {
        align: "left",
        bulletIndent: 30,
        bulletRadius: 2,
        indent: 120,
        indentAllLines: true,
      }
    );
  }

  if (customResume.presentations && customResume.presentations.length) {
    doc
      .moveDown()
      .fillColor("#1171BA")
      .text("Presentations", {
        align: "left",
        width: 100,
      })
      .moveUp()
      .fillColor("black");

    doc.list(
      customResume.presentations.map((presentation) => presentation.title),
      {
        align: "left",
        bulletIndent: 30,
        bulletRadius: 2,
        indent: 120,
        indentAllLines: true,
      }
    );
  }

  if (customResume.projects && customResume.projects.length) {
    doc
      .moveDown()
      .fillColor("#1171BA")
      .text("Projects", {
        align: "left",
        width: 100,
      })
      .moveUp()
      .fillColor("black");

    doc.list(
      customResume.projects.map((project) => project.title),
      {
        align: "left",
        bulletIndent: 30,
        bulletRadius: 2,
        indent: 120,
        indentAllLines: true,
      }
    );
  }

  if (customResume.conferences && customResume.conferences.length) {
    doc
      .moveDown()
      .fillColor("#1171BA")
      .text("Conferences", {
        align: "left",
        width: 100,
      })
      .moveUp()
      .fillColor("black");

    doc.list(
      customResume.conferences.map((conference) => conference.title),
      {
        align: "left",
        bulletIndent: 30,
        bulletRadius: 2,
        indent: 120,
        indentAllLines: true,
      }
    );
  }

  if (customResume.seminars && customResume.seminars.length) {
    doc
      .moveDown()
      .fillColor("#1171BA")
      .text("Seminars", {
        align: "left",
        width: 100,
      })
      .moveUp()
      .fillColor("black");

    doc.list(
      customResume.seminars.map((seminar) => seminar.title),
      {
        align: "left",
        bulletIndent: 30,
        bulletRadius: 2,
        indent: 120,
        indentAllLines: true,
      }
    );
  }

  if (customResume.awards && customResume.awards.length) {
    doc
      .moveDown()
      .fillColor("#1171BA")
      .text("Honours And Awards", {
        align: "left",
        width: 100,
      })
      .moveUp()
      .fillColor("black");

    doc.list(
      customResume.awards.map((award) => award.title),
      {
        align: "left",
        bulletIndent: 30,
        bulletRadius: 2,
        indent: 120,
        indentAllLines: true,
      }
    );
  }

  if (customResume.memberships && customResume.memberships.length) {
    doc
      .moveDown()
      .fillColor("#1171BA")
      .text("Memberships", {
        align: "left",
        width: 100,
      })
      .moveUp()
      .fillColor("black");

    doc.list(
      customResume.memberships.map((membership) => membership.title),
      {
        align: "left",
        bulletIndent: 30,
        bulletRadius: 2,
        indent: 120,
        indentAllLines: true,
      }
    );
  }

  if (customResume.references && customResume.references.length) {
    doc
      .moveDown()
      .fillColor("#1171BA")
      .text("References", {
        align: "left",
        width: 100,
      })
      .moveUp()
      .fillColor("black");

    doc.list(
      customResume.references.map(
        (reference) =>
          `${reference.name} - ${reference.designation}, ${reference.department}, ${reference.institute} (Email: ${reference.email})`
      ),
      {
        align: "left",
        bulletIndent: 30,
        bulletRadius: 2,
        indent: 120,
        indentAllLines: true,
      }
    );
  }

  if (customResume.citations && customResume.citations.length) {
    doc
      .moveDown()
      .fillColor("#1171BA")
      .text("Citations", {
        align: "left",
        width: 100,
      })
      .moveUp()
      .fillColor("black");

    doc.list(
      customResume.citations.map((citation) => citation.title),
      {
        align: "left",
        bulletIndent: 30,
        bulletRadius: 2,
        indent: 120,
        indentAllLines: true,
      }
    );
  }

  if (customResume.courses && customResume.courses.length) {
    doc
      .moveDown()
      .fillColor("#1171BA")
      .text("Courses", {
        align: "left",
        width: 100,
      })
      .moveUp()
      .fillColor("black");

    doc.list(
      customResume.courses.map((course) => course.title),
      {
        align: "left",
        bulletIndent: 30,
        bulletRadius: 2,
        indent: 120,
        indentAllLines: true,
      }
    );
  }

  if (customResume.certifications && customResume.certifications.length) {
    doc
      .moveDown()
      .fillColor("#1171BA")
      .text("Certifications", {
        align: "left",
        width: 100,
      })
      .moveUp()
      .fillColor("black");

    doc.list(
      customResume.certifications.map((certification) => certification.title),
      {
        align: "left",
        bulletIndent: 30,
        bulletRadius: 2,
        indent: 120,
        indentAllLines: true,
      }
    );
  }

  if (customResume.trainings && customResume.trainings.length) {
    doc.moveDown(2).fillColor("#1171BA").text("ANNEXES", {
      align: "left",
      width: 100,
    });

    doc
      .lineWidth(1)
      .strokeColor("#1171BA")
      .moveTo(doc.page.margins.left, doc.y)
      .lineTo(doc.page.width - doc.page.margins.right, doc.y)
      .stroke()
      .moveDown()
      .fillColor("black");

    doc.list(
      customResume.annexes.map((annex) => annex.title),
      {
        align: "left",
        bulletIndent: 30,
        bulletRadius: 2,
        indent: 120,
        indentAllLines: true,
      }
    );
  }

  doc.end();

  return await new Promise<Buffer<ArrayBuffer>>((resolve, reject) => {
    doc.on("end", () => resolve(Buffer.concat(chunks))).on("error", reject);
  });
};
