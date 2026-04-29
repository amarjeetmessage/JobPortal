const requiredEnvVars = [
    "MONGO_URI",
    "SECRET_KEY",
    "CLOUD_NAME",
    "API_KEY",
    "API_SECRET",
];

export const env = {
    get nodeEnv() {
        return process.env.NODE_ENV || "development";
    },
    get port() {
        return Number(process.env.PORT || 8000);
    },
    get mongoUri() {
        return process.env.MONGO_URI;
    },
    get jwtSecret() {
        return process.env.SECRET_KEY;
    },
    get clientUrls() {
        const rawClientUrls = process.env.CLIENT_URL || "http://localhost:5173";

        return rawClientUrls
            .split(",")
            .map((value) => value.trim())
            .filter(Boolean);
    },
    get cloudinaryCloudName() {
        return process.env.CLOUD_NAME;
    },
    get cloudinaryApiKey() {
        return process.env.API_KEY;
    },
    get cloudinaryApiSecret() {
        return process.env.API_SECRET;
    },
    get maxFileSizeBytes() {
        return Number(process.env.MAX_FILE_SIZE_BYTES || 5 * 1024 * 1024);
    },
};

export const validateEnv = () => {
    const missing = requiredEnvVars.filter((key) => !process.env[key]);

    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
    }
};
