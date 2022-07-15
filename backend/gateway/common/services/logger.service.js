const {format, createLogger, transports} = require('winston');
const {timestamp, combine, printf, colorize, errors} = format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} ${level}: ${stack || message}`;
});

//todo: change to json for log aggregation in production

const logger = createLogger({
    level: 'debug',
    format: combine(
        colorize(),
        timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        errors({stack: true}),
        logFormat
    ),
    //defaultMeta: { service: 'user-service' },
    transports: [
        new transports.File({ filename: './logs/errors/error.log', level: 'error' }),
        new transports.File({ filename: './logs/combined/combined.log' }),
    ],
});


module.exports = logger
