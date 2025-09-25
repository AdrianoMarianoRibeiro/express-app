"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const application_1 = require("./core/application");
const app_module_1 = require("./modules/app.module");
const database_config_1 = __importDefault(require("./database/database.config"));
async function bootstrap() {
    const app = new application_1.ExpressApplication();
    try {
        await app.bootstrap(app_module_1.AppModule, database_config_1.default);
        const port = parseInt(process.env.PORT || "3000");
        app.listen(port);
        console.log(`🚀 Application is running on: http://localhost:${port}`);
    }
    catch (error) {
        console.error("Failed to start application:", error);
        process.exit(1);
    }
}
bootstrap();
