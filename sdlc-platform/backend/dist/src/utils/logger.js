"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
require("winston-daily-rotate-file");
const path_1 = __importDefault(require("path"));
const { combine, timestamp, printf, colorize, align } = winston_1.default.format;
const logFormat = printf(({ level, message, timestamp: logTimestamp, ...meta }) => {
    const metaString = Object.keys(meta).length ? `\n${JSON.stringify(meta, null, 2)}` : '';
    return `[${logTimestamp}] ${level}: ${message}${metaString}`;
});
// Create logs directory if it doesn't exist
const logDir = path_1.default.join(process.cwd(), 'logs');
const logger = winston_1.default.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.default.format.errors({ stack: true }), winston_1.default.format.splat(), winston_1.default.format.json()),
    defaultMeta: { service: 'sdlc-platform' },
    transports: [
        // Write all logs with level `error` and below to `error.log`
        new winston_1.default.transports.DailyRotateFile({
            filename: path_1.default.join(logDir, 'error-%DATE%.log'),
            level: 'error',
            maxSize: '20m',
            maxFiles: '30d',
        }),
        // Write all logs with level `info` and below to `combined.log`
        new winston_1.default.transports.DailyRotateFile({
            filename: path_1.default.join(logDir, 'combined-%DATE%.log'),
            maxSize: '20m',
            maxFiles: '30d',
        }),
    ],
});
exports.logger = logger;
// If we're not in production, log to the console as well
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston_1.default.transports.Console({
        format: combine(colorize({ all: true }), timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }), align(), logFormat),
    }));
}
