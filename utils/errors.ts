export class TestError extends Error {
    constructor(
        message: string,
        public readonly context?: any,
        public readonly category: 'navigation' | 'element' | 'assertion' | 'network' = 'assertion'
    ) {
        super(message);
        this.name = 'TestError';
        
    }
}

export class NavigationError extends TestError {
    constructor(message: string, context?: any) {
        super(message, context, 'navigation');
        this.name = 'NavigationError';
    }
}

export class ElementError extends TestError {
    constructor(message: string, context?: any) {
        super(message, context, 'element');
        this.name = 'ElementError';
    }
}

export class NetworkError extends TestError {
    constructor(message: string, context?: any) {
        super(message, context, 'network');
        this.name = 'NetworkError';
    }
}
export interface TestInfoError {
    message: string;
    stack?: string;
    value: string;
    cause?: TestInfoError;
}
export interface TestError extends Error {
    testTitle?: string;
    errorType?: string;
    additionalData?: any;
}
export function convertToTestInfoError(error: Error): TestInfoError {
    return {
        message: error.message,
        stack: error.stack,
        value: error.toString(),
        cause: error.cause as TestInfoError | undefined
    };
}
export function categorizeError(error: Error): string {
    if (error.message.includes('net::')) return 'network';
    if (error.message.includes('timeout')) return 'timeout';
    return 'unknown';
}