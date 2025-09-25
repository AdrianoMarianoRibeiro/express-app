"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const tsyringe_1 = require("tsyringe");
const controller_decorator_1 = require("../decorators/controller.decorator");
const api_response_dto_1 = require("../dto/common/api-response.dto");
let AppController = class AppController {
    getHello(req, res) {
        return new api_response_dto_1.ApiResponseDto({
            message: "Hello World!",
            version: "1.0.0",
            uptime: process.uptime(),
        }, "API is running successfully");
    }
    healthCheck(req, res) {
        return new api_response_dto_1.ApiResponseDto({
            status: "OK",
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            memory: process.memoryUsage(),
        }, "Health check passed");
    }
};
exports.AppController = AppController;
__decorate([
    (0, controller_decorator_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getHello", null);
__decorate([
    (0, controller_decorator_1.Get)("/health"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "healthCheck", null);
exports.AppController = AppController = __decorate([
    (0, controller_decorator_1.Controller)(),
    (0, tsyringe_1.injectable)()
], AppController);
