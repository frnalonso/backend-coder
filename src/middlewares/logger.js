import winston from 'winston'
const customLevelOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5,
    },
    colors: {
        fatal: "red",
        error: "magenta",
        warning: "yellow",
        info: "blue",
        http: "green",
        debug: "white",
    },
};

winston.addColors(customLevelOptions.colors);

const customFormat = winston.format.printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
});

const devLogger = winston.createLogger({
    level: 'debug',
    levels: customLevelOptions.levels,
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        customFormat
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: './warnings-dev.log', level: 'warning' })
    ]
});

const prodLogger = winston.createLogger({
    level: 'info',
    levels: customLevelOptions.levels,
    format: winston.format.combine(
        winston.format.timestamp(),
        customFormat
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                customFormat
            )
        }),
        new winston.transports.File({ filename: './errors-prod.log', level: 'error' }),
        new winston.transports.File({ filename: './fatal-prod.log', level: 'fatal' })
    ]
});

export { devLogger, prodLogger };