"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressApplication = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const typeorm_1 = require("typeorm");
const tsyringe_1 = require("tsyringe");
const controller_decorator_1 = require("../decorators/controller.decorator");
const module_decorator_1 = require("../decorators/module.decorator");
class ExpressApplication {
    constructor() {
        this.app = (0, express_1.default)();
        this.setupMiddlewares();
    }
    setupMiddlewares() {
        this.app.use((0, helmet_1.default)());
        this.app.use((0, cors_1.default)());
        this.app.use((0, morgan_1.default)("combined"));
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
    }
    async bootstrap(AppModule, dataSource) {
        if (dataSource) {
            await dataSource.initialize();
            console.log("Database connected successfully");
            tsyringe_1.container.registerInstance(typeorm_1.DataSource, dataSource);
        }
        this.loadModule(AppModule);
        this.setupErrorHandling();
    }
    loadModule(ModuleClass) {
        const moduleMetadata = Reflect.getMetadata(module_decorator_1.MODULE_KEY, ModuleClass);
        if (!moduleMetadata) {
            throw new Error(`${ModuleClass.name} is not a valid module`);
        }
        if (moduleMetadata.imports) {
            moduleMetadata.imports.forEach((importedModule) => {
                this.loadModule(importedModule);
            });
        }
        if (moduleMetadata.providers) {
            moduleMetadata.providers.forEach((provider) => {
                tsyringe_1.container.registerSingleton(provider);
            });
        }
        if (moduleMetadata.controllers) {
            moduleMetadata.controllers.forEach((controller) => {
                tsyringe_1.container.registerSingleton(controller);
                this.registerController(controller);
            });
        }
    }
    registerController(ControllerClass) {
        const controllerPrefix = Reflect.getMetadata(controller_decorator_1.CONTROLLER_KEY, ControllerClass);
        const routes = Reflect.getMetadata(controller_decorator_1.ROUTES_KEY, ControllerClass) || [];
        const controllerInstance = tsyringe_1.container.resolve(ControllerClass);
        routes.forEach((route) => {
            const fullPath = `${controllerPrefix}${route.path}`;
            this.app[route.requestMethod](fullPath, async (req, res) => {
                try {
                    const result = await controllerInstance[route.methodName](req, res);
                    if (result !== undefined && !res.headersSent) {
                        res.json(result);
                    }
                }
                catch (error) {
                    console.error("Controller error:", error);
                    if (!res.headersSent) {
                        res.status(500).json({ error: "Internal server error" });
                    }
                }
            });
            console.log(`Registered route: ${route.requestMethod.toUpperCase()} ${fullPath}`);
        });
    }
    setupErrorHandling() {
        this.app.use((err, req, res, next) => {
            console.error(err.stack);
            res.status(500).json({ error: "Something went wrong!" });
        });
        this.app.use((req, res) => {
            res.status(404).json({ error: "Route not found" });
        });
    }
    listen(port) {
        this.app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    }
}
exports.ExpressApplication = ExpressApplication;
