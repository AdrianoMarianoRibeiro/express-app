export interface ModuleOptions {
    controllers?: any[];
    providers?: any[];
    imports?: any[];
    exports?: any[];
}
export declare const MODULE_KEY: unique symbol;
export declare function Module(options: ModuleOptions): (target: any) => void;
