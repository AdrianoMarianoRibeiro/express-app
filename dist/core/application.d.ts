import { DataSource } from "typeorm";
export declare class ExpressApplication {
    private app;
    constructor();
    private setupMiddlewares;
    bootstrap(AppModule: any, dataSource?: DataSource): Promise<void>;
    private loadModule;
    private registerController;
    private setupErrorHandling;
    listen(port: number): void;
}
