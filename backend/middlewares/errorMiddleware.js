export const notFound = (req, res) => {
    return res.status(404).json({
        message: `Route not found: ${req.originalUrl}`,
        success: false,
    });
};

export const errorHandler = (error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal server error";

    if (process.env.NODE_ENV !== "production") {
        console.error(error);
    }

    return res.status(statusCode).json({
        message,
        success: false,
    });
};
