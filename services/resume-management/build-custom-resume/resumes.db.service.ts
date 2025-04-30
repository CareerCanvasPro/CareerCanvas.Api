import {
  CustomResumeAnnex,
  CustomResumeAward,
  CustomResumeCertification,
  CustomResumeCitation,
  CustomResumeCommunicationSkill,
  CustomResumeComputerCertificate,
  CustomResumeComputerSkill,
  CustomResumeConference,
  CustomResumeCourse,
  CustomResumeEca,
  CustomResumeEducation,
  CustomResumeJobSkill,
  CustomResumeManagerialSkill,
  CustomResumeMembership,
  CustomResumeOtherLanguage,
  CustomResumeOtherSkill,
  CustomResumePresentation,
  CustomResumeProject,
  CustomResumePublication,
  CustomResumeReference,
  CustomResumeResearchExperience,
  CustomResumeSeminar,
  CustomResumeTraining,
  CustomResumeWorkExperience,
} from "@prisma/client";
import cuid from "cuid";

import { prismaClient } from "./config";

export interface CustomResume {
  address: string | null | undefined;
  communicationLevel: string | null | undefined;
  contentCreationLevel: string | null | undefined;
  dateOfBirth: number | null | undefined;
  drivingLicenseCategory: string | null | undefined;
  email: string;
  informationProcessingLevel: string | null | undefined;
  jobAppliedFor: string | null | undefined;
  linkedIn: string | null | undefined;
  mobile: string;
  motherTongue: string | null | undefined;
  name: string;
  nationality: string | null | undefined;
  personalStatement: string | null | undefined;
  position: string | null | undefined;
  preferredJob: string | null | undefined;
  problemSolvingLevel: string | null | undefined;
  profilePicture: string | null | undefined;
  safetyLevel: string | null | undefined;
  sex: string | null | undefined;
  studiesAppliedFor: string | null | undefined;
  telephone: string | null | undefined;
  website: string | null | undefined;
  annexes: Pick<CustomResumeAnnex, "title">[];
  awards: Pick<CustomResumeAward, "title">[];
  certifications: Pick<CustomResumeCertification, "title">[];
  citations: Pick<CustomResumeCitation, "title">[];
  communicationSkills: Pick<CustomResumeCommunicationSkill, "title">[];
  computerCertificates: Pick<CustomResumeComputerCertificate, "title">[];
  computerSkills: Pick<CustomResumeComputerSkill, "title">[];
  conferences: Pick<CustomResumeConference, "title">[];
  courses: Pick<CustomResumeCourse, "title">[];
  ecas: Pick<CustomResumeEca, "description" | "title">[];
  educations: Pick<
    CustomResumeEducation,
    | "cgpa"
    | "completedSemesters"
    | "degree"
    | "department"
    | "field"
    | "graduationDate"
    | "institute"
    | "instituteLocation"
    | "totalSemesters"
  >[];
  jobSkills: Pick<CustomResumeJobSkill, "title">[];
  managerialSkills: Pick<CustomResumeManagerialSkill, "title">[];
  memberships: Pick<CustomResumeMembership, "title">[];
  otherLanguages: Pick<
    CustomResumeOtherLanguage,
    | "listeningLevel"
    | "readingLevel"
    | "spokenInteractionLevel"
    | "spokenProductionLevel"
    | "title"
    | "writingLevel"
  >[];
  otherSkills: Pick<CustomResumeOtherSkill, "title">[];
  presentations: Pick<CustomResumePresentation, "title">[];
  projects: Pick<CustomResumeProject, "description" | "title">[];
  publications: Pick<CustomResumePublication, "title">[];
  references: Pick<
    CustomResumeReference,
    "department" | "designation" | "email" | "institute" | "name"
  >[];
  researchExperiences: Pick<
    CustomResumeResearchExperience,
    "description" | "title"
  >[];
  seminars: Pick<CustomResumeSeminar, "title">[];
  trainings: Pick<
    CustomResumeTraining,
    | "description"
    | "endDate"
    | "eqfLevel"
    | "isCurrent"
    | "organization"
    | "organizationLocation"
    | "startDate"
    | "title"
  >[];
  workExperiences: Pick<
    CustomResumeWorkExperience,
    | "description"
    | "designation"
    | "endDate"
    | "isCurrent"
    | "organization"
    | "organizationLocation"
    | "organizationWebsite"
    | "startDate"
  >[];
}

export const createCustomResume = async ({
  customResume,
  id,
  userId,
}: {
  customResume: CustomResume;
  id: string | null | undefined;
  userId: string;
}): Promise<{ customResumeId: string }> => {
  if (id) {
    await prismaClient.customResume.delete({ where: { id } });
  }

  const customResumeId = id ? id : cuid();

  await prismaClient.customResume.create({
    data: {
      address: customResume.address,
      annexes: customResume.annexes
        ? {
            create: customResume.annexes,
          }
        : undefined,
      awards: customResume.awards
        ? {
            create: customResume.awards,
          }
        : undefined,
      certifications: customResume.certifications
        ? {
            create: customResume.certifications,
          }
        : undefined,
      citations: customResume.citations
        ? {
            create: customResume.citations,
          }
        : undefined,
      communicationLevel: customResume.communicationLevel,
      communicationSkills: customResume.communicationSkills
        ? {
            create: customResume.communicationSkills,
          }
        : undefined,
      computerCertificates: customResume.computerCertificates
        ? {
            create: customResume.computerCertificates,
          }
        : undefined,
      computerSkills: customResume.computerSkills
        ? {
            create: customResume.computerSkills,
          }
        : undefined,
      conferences: customResume.conferences
        ? {
            create: customResume.conferences,
          }
        : undefined,
      contentCreationLevel: customResume.contentCreationLevel,
      courses: customResume.courses
        ? {
            create: customResume.courses,
          }
        : undefined,
      dateOfBirth: customResume.dateOfBirth
        ? new Date(customResume.dateOfBirth)
        : null,
      drivingLicenseCategory: customResume.drivingLicenseCategory,
      ecas: customResume.ecas
        ? {
            create: customResume.ecas,
          }
        : undefined,
      educations: customResume.educations
        ? {
            create: customResume.educations.map((education) => ({
              ...education,
              graduationDate: new Date(education.graduationDate),
            })),
          }
        : undefined,
      email: customResume.email,
      id: customResumeId,
      informationProcessingLevel: customResume.informationProcessingLevel,
      jobAppliedFor: customResume.jobAppliedFor,
      jobSkills: customResume.jobSkills
        ? {
            create: customResume.jobSkills,
          }
        : undefined,
      linkedIn: customResume.linkedIn,
      managerialSkills: customResume.managerialSkills
        ? {
            create: customResume.managerialSkills,
          }
        : undefined,
      memberships: customResume.memberships
        ? {
            create: customResume.memberships,
          }
        : undefined,
      mobile: customResume.mobile,
      motherTongue: customResume.motherTongue,
      name: customResume.name,
      nationality: customResume.nationality,
      otherLanguages: customResume.otherLanguages
        ? {
            create: customResume.otherLanguages,
          }
        : undefined,
      otherSkills: customResume.otherSkills
        ? {
            create: customResume.otherSkills,
          }
        : undefined,
      personalStatement: customResume.personalStatement,
      position: customResume.position,
      preferredJob: customResume.preferredJob,
      presentations: customResume.presentations
        ? {
            create: customResume.presentations,
          }
        : undefined,
      problemSolvingLevel: customResume.problemSolvingLevel,
      profilePicture: customResume.profilePicture,
      projects: customResume.projects
        ? {
            create: customResume.projects,
          }
        : undefined,
      publications: customResume.publications
        ? {
            create: customResume.publications,
          }
        : undefined,
      references: customResume.references
        ? {
            create: customResume.references,
          }
        : undefined,
      researchExperiences: customResume.researchExperiences
        ? {
            create: customResume.researchExperiences,
          }
        : undefined,
      safetyLevel: customResume.safetyLevel,
      seminars: customResume.seminars
        ? {
            create: customResume.seminars,
          }
        : undefined,
      sex: customResume.sex,
      studiesAppliedFor: customResume.studiesAppliedFor,
      telephone: customResume.telephone,
      trainings: customResume.trainings
        ? {
            create: customResume.trainings.map((training) => ({
              ...training,
              endDate: training.endDate ? new Date(training.endDate) : null,
              startDate: new Date(training.startDate),
            })),
          }
        : undefined,
      userId,
      website: customResume.website,
      workExperiences: customResume.workExperiences
        ? {
            create: customResume.workExperiences.map((workExperience) => ({
              ...workExperience,
              endDate: workExperience.endDate
                ? new Date(workExperience.endDate)
                : null,
              startDate: new Date(workExperience.startDate),
            })),
          }
        : undefined,
    },
  });

  return { customResumeId };
};
