export const errorHandler = (err, req, res, next) => {
    const { statusCode, message } = err;
    res.status(statusCode || 500).json({
        status: "error",
        statusCode: statusCode || 500,
        message: message || "Internal Server Error",
    });
};
