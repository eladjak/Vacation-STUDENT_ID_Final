declare const logger: import("winston").Logger;
declare const loggerStream: {
    write: (message: string) => void;
};
export { logger, loggerStream };
