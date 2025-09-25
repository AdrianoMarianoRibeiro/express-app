import "reflect-metadata";
export interface RouteDefinition {
    path: string;
    requestMethod: "get" | "post" | "put" | "delete" | "patch";
    methodName: string | symbol;
}
export declare const ROUTES_KEY: unique symbol;
export declare const CONTROLLER_KEY: unique symbol;
export declare function Controller(prefix?: string): (target: any) => void;
export declare const Get: (path?: string) => (target: any, propertyKey: string | symbol) => void;
export declare const Post: (path?: string) => (target: any, propertyKey: string | symbol) => void;
export declare const Put: (path?: string) => (target: any, propertyKey: string | symbol) => void;
export declare const Delete: (path?: string) => (target: any, propertyKey: string | symbol) => void;
export declare const Patch: (path?: string) => (target: any, propertyKey: string | symbol) => void;
