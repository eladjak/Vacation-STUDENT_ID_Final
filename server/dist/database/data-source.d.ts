import { ConnectionOptions } from 'typeorm';
declare const AppDataSource: ConnectionOptions;
declare function initializeConnection(): Promise<any>;
export { AppDataSource, initializeConnection };
export default AppDataSource;
