export const emptyEducation = () => ({
  school: "",
  degree: "",
  fieldOfStudy: "",
  startYear: "",
  endYear: "",
  grade: "",
  description: "",
});

export const emptyExperience = () => ({
  company: "",
  title: "",
  employmentType: "",
  location: "",
  startDate: "",
  endDate: "",
  currentlyWorking: false,
  summary: "",
  achievements: [],
});

export const emptyProject = () => ({
  name: "",
  role: "",
  techStack: [],
  link: "",
  summary: "",
});

export const normalizeUserProfile = (user) => ({
  fullname: user?.fullname || "",
  email: user?.email || "",
  phoneNumber: user?.phoneNumber?.toString?.() || "",
  role: user?.role || "student",
  profile: {
    bio: user?.profile?.bio || "",
    headline: user?.profile?.headline || "",
    location: user?.profile?.location || "",
    website: user?.profile?.website || "",
    linkedinUrl: user?.profile?.linkedinUrl || "",
    githubUrl: user?.profile?.githubUrl || "",
    portfolioUrl: user?.profile?.portfolioUrl || "",
    currentCompany: user?.profile?.currentCompany || "",
    currentPosition: user?.profile?.currentPosition || "",
    experienceLevel: user?.profile?.experienceLevel || "",
    totalExperience: user?.profile?.totalExperience || "",
    salaryExpectation: user?.profile?.salaryExpectation || "",
    noticePeriod: user?.profile?.noticePeriod || "",
    openToWork: typeof user?.profile?.openToWork === "boolean" ? user.profile.openToWork : true,
    skills: Array.isArray(user?.profile?.skills) ? user.profile.skills : [],
    languages: Array.isArray(user?.profile?.languages) ? user.profile.languages : [],
    strengths: Array.isArray(user?.profile?.strengths) ? user.profile.strengths : [],
    achievements: Array.isArray(user?.profile?.achievements) ? user.profile.achievements : [],
    certifications: Array.isArray(user?.profile?.certifications) ? user.profile.certifications : [],
    preferredJobTypes: Array.isArray(user?.profile?.preferredJobTypes) ? user.profile.preferredJobTypes : [],
    preferredLocations: Array.isArray(user?.profile?.preferredLocations) ? user.profile.preferredLocations : [],
    education: Array.isArray(user?.profile?.education) && user.profile.education.length ? user.profile.education : [emptyEducation()],
    experience: Array.isArray(user?.profile?.experience) && user.profile.experience.length ? user.profile.experience : [emptyExperience()],
    projects: Array.isArray(user?.profile?.projects) && user.profile.projects.length ? user.profile.projects : [emptyProject()],
    resume: user?.profile?.resume || "",
    resumeOriginalName: user?.profile?.resumeOriginalName || "",
    profilePhoto: user?.profile?.profilePhoto || "",
  },
});

export const parseCommaSeparated = (value) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

export const joinCommaSeparated = (items = []) => items.filter(Boolean).join(", ");

export const buildProfilePayload = (formState) => ({
  fullname: formState.fullname.trim(),
  email: formState.email.trim(),
  phoneNumber: formState.phoneNumber.trim(),
  bio: formState.profile.bio.trim(),
  headline: formState.profile.headline.trim(),
  location: formState.profile.location.trim(),
  website: formState.profile.website.trim(),
  linkedinUrl: formState.profile.linkedinUrl.trim(),
  githubUrl: formState.profile.githubUrl.trim(),
  portfolioUrl: formState.profile.portfolioUrl.trim(),
  currentCompany: formState.profile.currentCompany.trim(),
  currentPosition: formState.profile.currentPosition.trim(),
  experienceLevel: formState.profile.experienceLevel.trim(),
  totalExperience: formState.profile.totalExperience.trim(),
  salaryExpectation: formState.profile.salaryExpectation.trim(),
  noticePeriod: formState.profile.noticePeriod.trim(),
  openToWork: String(formState.profile.openToWork),
  skills: joinCommaSeparated(formState.profile.skills),
  languages: joinCommaSeparated(formState.profile.languages),
  strengths: joinCommaSeparated(formState.profile.strengths),
  achievements: joinCommaSeparated(formState.profile.achievements),
  certifications: joinCommaSeparated(formState.profile.certifications),
  preferredJobTypes: joinCommaSeparated(formState.profile.preferredJobTypes),
  preferredLocations: joinCommaSeparated(formState.profile.preferredLocations),
  education: JSON.stringify(formState.profile.education),
  experience: JSON.stringify(formState.profile.experience),
  projects: JSON.stringify(formState.profile.projects),
});

const completionChecks = [
  { label: "Add a professional headline", check: (profile) => Boolean(profile.headline) },
  { label: "Write a short bio", check: (profile) => Boolean(profile.bio) },
  { label: "Upload a profile photo", check: (profile) => Boolean(profile.profilePhoto) },
  { label: "Upload your resume", check: (profile) => Boolean(profile.resume) },
  { label: "Add at least 3 skills", check: (profile) => profile.skills.length >= 3 },
  { label: "Add your location", check: (profile) => Boolean(profile.location) },
  { label: "Add at least 1 education entry", check: (profile) => profile.education.some((item) => item.school || item.degree) },
  { label: "Add at least 1 experience entry", check: (profile) => profile.experience.some((item) => item.company || item.title) },
  { label: "Add 1 project or portfolio link", check: (profile) => profile.projects.some((item) => item.name || item.link) || Boolean(profile.portfolioUrl) },
  { label: "Add LinkedIn or GitHub profile", check: (profile) => Boolean(profile.linkedinUrl || profile.githubUrl) },
];

export const getProfileCompletion = (profile) => {
  const completed = completionChecks.filter((item) => item.check(profile)).length;
  return Math.round((completed / completionChecks.length) * 100);
};

export const getProfileSuggestions = (profile) =>
  completionChecks
    .filter((item) => !item.check(profile))
    .map((item) => item.label);
