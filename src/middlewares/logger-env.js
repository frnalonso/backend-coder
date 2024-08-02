import { devLogger, prodLogger } from "./logger.js";

export const addLogger = (req, res, next) => {
    const env = process.env.NODE_ENV || 'development';
    req.logger = env === 'PRODUCTION' ? prodLogger : devLogger;

    req.logger.http(
        `${req.method} ${req.url} - ${new Date().toLocaleTimeString()}`
    );
    next();
};