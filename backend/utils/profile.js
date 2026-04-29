const normalizeString = (value) => {
    if (typeof value !== "string") {
        return "";
    }

    return value.trim();
};

const ensureArray = (value) => {
    if (Array.isArray(value)) {
        return value;
    }

    if (!value) {
        return [];
    }

    return [value];
};

const normalizeList = (value) => {
    if (Array.isArray(value)) {
        return value
            .map((item) => normalizeString(item))
            .filter(Boolean);
    }

    if (typeof value === "string") {
        return value
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
    }

    return [];
};

const normalizeEducation = (entries) =>
    ensureArray(entries)
        .map((entry) => ({
            school: normalizeString(entry?.school),
            degree: normalizeString(entry?.degree),
            fieldOfStudy: normalizeString(entry?.fieldOfStudy),
            startYear: normalizeString(entry?.startYear),
            endYear: normalizeString(entry?.endYear),
            grade: normalizeString(entry?.grade),
            description: normalizeString(entry?.description),
        }))
        .filter((entry) => entry.school || entry.degree || entry.fieldOfStudy);

const normalizeExperience = (entries) =>
    ensureArray(entries)
        .map((entry) => ({
            company: normalizeString(entry?.company),
            title: normalizeString(entry?.title),
            employmentType: normalizeString(entry?.employmentType),
            location: normalizeString(entry?.location),
            startDate: normalizeString(entry?.startDate),
            endDate: normalizeString(entry?.endDate),
            currentlyWorking: Boolean(entry?.currentlyWorking),
            summary: normalizeString(entry?.summary),
            achievements: normalizeList(entry?.achievements),
        }))
        .filter((entry) => entry.company || entry.title);

const normalizeProjects = (entries) =>
    ensureArray(entries)
        .map((entry) => ({
            name: normalizeString(entry?.name),
            role: normalizeString(entry?.role),
            techStack: normalizeList(entry?.techStack),
            link: normalizeString(entry?.link),
            summary: normalizeString(entry?.summary),
        }))
        .filter((entry) => entry.name || entry.summary);

export const parseProfileJson = (value, fallback = []) => {
    if (!value) {
        return fallback;
    }

    if (Array.isArray(value)) {
        return value;
    }

    if (typeof value !== "string") {
        return fallback;
    }

    try {
        return JSON.parse(value);
    } catch {
        return fallback;
    }
};

export const buildProfileUpdates = (input = {}) => ({
    bio: normalizeString(input.bio),
    headline: normalizeString(input.headline),
    location: normalizeString(input.location),
    website: normalizeString(input.website),
    linkedinUrl: normalizeString(input.linkedinUrl),
    githubUrl: normalizeString(input.githubUrl),
    portfolioUrl: normalizeString(input.portfolioUrl),
    currentCompany: normalizeString(input.currentCompany),
    currentPosition: normalizeString(input.currentPosition),
    experienceLevel: normalizeString(input.experienceLevel),
    totalExperience: normalizeString(input.totalExperience),
    salaryExpectation: normalizeString(input.salaryExpectation),
    noticePeriod: normalizeString(input.noticePeriod),
    openToWork: input.openToWork === "false" ? false : Boolean(input.openToWork),
    skills: normalizeList(input.skills),
    languages: normalizeList(input.languages),
    strengths: normalizeList(input.strengths),
    achievements: normalizeList(input.achievements),
    certifications: normalizeList(input.certifications),
    preferredJobTypes: normalizeList(input.preferredJobTypes),
    preferredLocations: normalizeList(input.preferredLocations),
    education: normalizeEducation(parseProfileJson(input.education)),
    experience: normalizeExperience(parseProfileJson(input.experience)),
    projects: normalizeProjects(parseProfileJson(input.projects)),
});

export const getUploadedFile = (req, fieldName) => {
    if (fieldName && req.files?.[fieldName]?.[0]) {
        return req.files[fieldName][0];
    }

    return req.file || req.files?.file?.[0] || null;
};
