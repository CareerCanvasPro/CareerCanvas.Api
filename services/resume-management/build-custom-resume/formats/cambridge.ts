import PDFDocument from "pdfkit-table";

import { CustomResume } from "../resumes.db.service";

export const buildCambridgeFormatResume = ({
  customResume,
}: {
  customResume: CustomResume;
}): Promise<Buffer<ArrayBuffer>> => {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];

    const doc = new PDFDocument({
      margin: 50,
      size: "A4",
    })
      .on("data", (chunk) => chunks.push(chunk))
      .on("end", () => resolve(Buffer.concat(chunks)))
      .on("error", reject);

    doc
      .fillColor("black")
      .font("Helvetica-Bold")
      .fontSize(12)
      .text(customResume.name, { align: "center" })
      .moveDown(0.25);

    doc
      .font("Helvetica")
      .text(
        `${customResume.educations[0].department}, ${customResume.educations[0].institute}, ${customResume.educations[0].instituteLocation}`,
        { align: "center" }
      )
      .moveDown(0.25);

    doc
      .text(`Email: ${customResume.email} | Mobile: ${customResume.mobile}`, {
        align: "center",
      })
      .moveDown(0.25);

    if (customResume.linkedIn) {
      doc
        .text(`LinkedIn: ${customResume.linkedIn}`, { align: "center" })
        .moveDown(0.25);
    }

    doc
      .moveDown(1.25)
      .font("Helvetica-Bold")
      .text("Academic Credentials", { align: "left" });

    doc
      .lineWidth(1)
      .strokeColor("black")
      .moveTo(doc.page.margins.left, doc.y)
      .lineTo(doc.page.width - doc.page.margins.right, doc.y)
      .stroke()
      .moveDown(0.25);

    customResume.educations.forEach((education) => {
      doc
        .moveDown(0.75)
        .font("Helvetica")
        .text(
          `•  ${education.degree} in ${education.field} | ${new Date(
            education.graduationDate
          ).toLocaleString("en-US", { month: "long", year: "numeric" })}${
            new Date(education.graduationDate) > new Date() ? " (Expected)" : ""
          }`,
          { align: "left", indent: 20 }
        )
        .moveDown(0.25);

      doc
        .text(
          `   ${education.department}, ${education.institute}, ${education.instituteLocation}`,
          { align: "left", indent: 20 }
        )
        .moveDown(0.25);

      doc
        .text(`CGPA: ${education.cgpa} out of 4.00`, { align: "right" })
        .moveDown(0.25);

      if (
        education.completedSemesters &&
        education.totalSemesters &&
        education.completedSemesters < education.totalSemesters
      ) {
        doc
          .text(
            `(${education.completedSemesters} out of ${education.totalSemesters})`,
            { align: "right" }
          )
          .moveDown(0.25);
      }
    });

    if (
      customResume.researchExperiences &&
      customResume.researchExperiences.length
    ) {
      doc
        .moveDown(1.25)
        .font("Helvetica-Bold")
        .text("Research Experience", { align: "left" });

      doc
        .moveTo(doc.page.margins.left, doc.y)
        .lineTo(doc.page.width - doc.page.margins.right, doc.y)
        .stroke()
        .moveDown(0.25);

      customResume.researchExperiences.forEach((researchExperience) => {
        doc
          .moveDown(0.75)
          .font("Helvetica-Bold")
          .text(`•  ${researchExperience.title}`, { align: "left", indent: 20 })
          .moveDown(0.25);

        if (researchExperience.description) {
          doc
            .font("Helvetica")
            .text(`   ${researchExperience.description}`, {
              align: "left",
              indent: 20,
            })
            .moveDown(0.25);
        }
      });
    }

    if (customResume.projects && customResume.projects.length) {
      doc
        .moveDown(1.25)
        .font("Helvetica-Bold")
        .text("Projects", { align: "left" });

      doc
        .moveTo(doc.page.margins.left, doc.y)
        .lineTo(doc.page.width - doc.page.margins.right, doc.y)
        .stroke()
        .moveDown(0.25);

      customResume.projects.forEach((project) => {
        doc
          .moveDown(0.75)
          .font("Helvetica-Bold")
          .text(`•  ${project.title}`, { align: "left", indent: 20 })
          .moveDown(0.25);

        if (project.description) {
          doc
            .font("Helvetica")
            .text(`   ${project.description}`, { align: "left", indent: 20 })
            .moveDown(0.25);
        }
      });
    }

    if (customResume.jobSkills && customResume.jobSkills.length) {
      doc
        .moveDown(1.25)
        .font("Helvetica-Bold")
        .text("Skills", { align: "left" });

      doc
        .moveTo(doc.page.margins.left, doc.y)
        .lineTo(doc.page.width - doc.page.margins.right, doc.y)
        .stroke()
        .moveDown();

      customResume.jobSkills.forEach((jobSkill) => {
        doc
          .font("Helvetica")
          .text(`•  ${jobSkill.title}`, { align: "left", indent: 20 })
          .moveDown(0.25);
      });
    }

    if (customResume.trainings && customResume.trainings.length) {
      doc
        .moveDown(1.25)
        .font("Helvetica-Bold")
        .text("Trainings and Workshops", { align: "left" });

      doc
        .moveTo(doc.page.margins.left, doc.y)
        .lineTo(doc.page.width - doc.page.margins.right, doc.y)
        .stroke()
        .moveDown(0.25);

      customResume.trainings.forEach((training) => {
        doc
          .moveDown(0.75)
          .font("Helvetica-Bold")
          .text(`•  ${training.title}`, { align: "left", indent: 20 })
          .moveDown(0.25);

        doc
          .font("Helvetica")
          .text(`   ${training.organization}`, { align: "left", indent: 20 })
          .moveDown(0.25);

        doc
          .text(
            `${new Date(training.startDate).toLocaleString("en-US", {
              month: "long",
              year: "numeric",
            })} - ${
              training.isCurrent
                ? "Present"
                : training.endDate
                ? new Date(training.endDate).toLocaleString("en-US", {
                    month: "long",
                    year: "numeric",
                  })
                : ""
            }`,
            { align: "right" }
          )
          .moveDown(0.25);

        if (training.description) {
          doc
            .text(`   ${training.description}`, { align: "left", indent: 20 })
            .moveDown(0.25);
        }
      });
    }

    if (customResume.workExperiences && customResume.workExperiences.length) {
      doc
        .moveDown(1.25)
        .font("Helvetica-Bold")
        .text("Professional Affiliation", { align: "left" });

      doc
        .moveTo(doc.page.margins.left, doc.y)
        .lineTo(doc.page.width - doc.page.margins.right, doc.y)
        .stroke()
        .moveDown(0.25);

      customResume.workExperiences.forEach((workExperience) => {
        doc
          .moveDown(0.75)
          .font("Helvetica-Bold")
          .text(`•  ${workExperience.designation}`, {
            align: "left",
            indent: 20,
          })
          .moveDown(0.25);

        doc
          .font("Helvetica")
          .text(`   ${workExperience.organization}`, {
            align: "left",
            indent: 20,
          })
          .moveDown(0.25);

        doc
          .text(
            `${new Date(workExperience.startDate).toLocaleString("en-US", {
              month: "long",
              year: "numeric",
            })} - ${
              workExperience.isCurrent
                ? "Present"
                : workExperience.endDate
                ? new Date(workExperience.endDate).toLocaleString("en-US", {
                    month: "long",
                    year: "numeric",
                  })
                : ""
            }`,
            { align: "right" }
          )
          .moveDown(0.25);

        if (workExperience.description) {
          doc
            .text(`   ${workExperience.description}`, {
              align: "left",
              indent: 20,
            })
            .moveDown(0.25);
        }
      });
    }

    if (customResume.ecas && customResume.ecas.length) {
      doc
        .moveDown(1.25)
        .font("Helvetica-Bold")
        .text("Extracurricular Activities", { align: "left" });

      doc
        .moveTo(doc.page.margins.left, doc.y)
        .lineTo(doc.page.width - doc.page.margins.right, doc.y)
        .stroke()
        .moveDown(0.25);

      customResume.ecas.forEach((eca) => {
        doc
          .moveDown(0.75)
          .font("Helvetica-Bold")
          .text(`•  ${eca.title}`, { align: "left", indent: 20 })
          .moveDown(0.25);

        if (eca.description) {
          doc
            .font("Helvetica")
            .text(`   ${eca.description}`, { align: "left", indent: 20 })
            .moveDown(0.25);
        }
      });
    }

    if (customResume.references && customResume.references.length) {
      doc
        .moveDown(1.25)
        .font("Helvetica-Bold")
        .text("References", { align: "left" });

      doc
        .moveTo(doc.page.margins.left, doc.y)
        .lineTo(doc.page.width - doc.page.margins.right, doc.y)
        .stroke()
        .moveDown(0.25);

      customResume.references.forEach((reference) => {
        doc
          .moveDown(0.75)
          .font("Helvetica")
          .text(`•  ${reference.name}`, { align: "left", indent: 20 })
          .moveDown(0.25);

        doc
          .text(`   ${reference.designation}`, { align: "left", indent: 20 })
          .moveDown(0.25);

        doc
          .text(`   ${reference.department}, ${reference.institute}`, {
            align: "left",
            indent: 20,
          })
          .moveDown(0.25);

        doc
          .text(`   Email: ${reference.email}`, { align: "left", indent: 20 })
          .moveDown(0.25);
      });
    }

    doc.end();
  });
};
