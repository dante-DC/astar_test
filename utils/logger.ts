export enum LogLevel {
    INFO = 'INFO',
    WARNING = 'WARNING',
    ERROR = 'ERROR',
    DEBUG = 'DEBUG'
}

export class Logger {
    constructor(private context: string) {}

    private static formatMessage(level: LogLevel, context: string, message: string, data?: any): string {
        const timestamp = new Date().toISOString();
        const dataString = data ? `\nData: ${JSON.stringify(data, null, 2)}` : '';
        return `${timestamp} [${level}] [${context}] ${message}${dataString}`;
    }

    info(message: string, data?: any) {
        console.log(Logger.formatMessage(LogLevel.INFO, this.context, message, data));
    }

    warning(message: string, data?: any) {
        console.warn(Logger.formatMessage(LogLevel.WARNING, this.context, message, data));
    }

    error(message: string, error?: TestError |Error, data?: any) {
        const errorData = error ? {
            message: error.message,
            stack: error.stack,
            ...data
        } : data;
        console.error(Logger.formatMessage(LogLevel.ERROR, this.context, message, errorData));
    }

    debug(message: string, data?: any) {
        if (process.env.DEBUG) {
            console.debug(Logger.formatMessage(LogLevel.DEBUG, this.context, message, data));
        }
    }

    static create(context: string): Logger {
        return new Logger(context);
    }
}

// Example usage:
// const logger = Logger.create('HomePage');
// logger.info('Navigation started', { url: 'https://example.com' });
// logger.error('Navigation failed', error, { attemptCount: 2 });
