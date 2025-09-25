"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Patch = exports.Delete = exports.Put = exports.Post = exports.Get = exports.CONTROLLER_KEY = exports.ROUTES_KEY = void 0;
exports.Controller = Controller;
require("reflect-metadata");
exports.ROUTES_KEY = Symbol("routes");
exports.CONTROLLER_KEY = Symbol("controller");
function Controller(prefix = "") {
    return function (target) {
        Reflect.defineMetadata(exports.CONTROLLER_KEY, prefix, target);
        if (!Reflect.hasMetadata(exports.ROUTES_KEY, target)) {
            Reflect.defineMetadata(exports.ROUTES_KEY, [], target);
        }
    };
}
function createMethodDecorator(method) {
    return function (path = "") {
        return function (target, propertyKey) {
            if (!Reflect.hasMetadata(exports.ROUTES_KEY, target.constructor)) {
                Reflect.defineMetadata(exports.ROUTES_KEY, [], target.constructor);
            }
            const routes = Reflect.getMetadata(exports.ROUTES_KEY, target.constructor);
            routes.push({
                requestMethod: method,
                path,
                methodName: propertyKey,
            });
            Reflect.defineMetadata(exports.ROUTES_KEY, routes, target.constructor);
        };
    };
}
exports.Get = createMethodDecorator("get");
exports.Post = createMethodDecorator("post");
exports.Put = createMethodDecorator("put");
exports.Delete = createMethodDecorator("delete");
exports.Patch = createMethodDecorator("patch");
