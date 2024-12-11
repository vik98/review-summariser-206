import { createLogger, format, transports, Logger as WinstonLogger } from 'winston';

class Logger {

    private static instance: Logger;
    private logger: WinstonLogger;

    private constructor() {
        this.logger = createLogger({
            level: 'info',
            format: format.json(),
            defaultMeta: { service: 'reviews-summariser-206' },
            transports: [
                new transports.File({ filename: 'logs/error.log', level: 'error' }),
                new transports.File({ filename: 'logs/status.log' }),
                new transports.Console({
                    format: format.simple(),
                }),
            ],
            exceptionHandlers: [new transports.File({ filename: 'logs/exceptions.log' })],
        });
    }

    static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    error(message: string, context?: object) {
        this.logger.error({ message, ...context });
    }

    info(message: string, context?: object) {
        this.logger.info({ message, ...context });
    }

    warn(message: string, context?: object) {
        this.logger.warn({ message, ...context });
    }

    log(level: string, message: string, context?: object) {
        this.logger.log(level, { message, ...context });
    }
}

export default Logger.getInstance();
