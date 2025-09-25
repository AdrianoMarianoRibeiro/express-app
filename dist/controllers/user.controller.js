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
exports.UserController = void 0;
const tsyringe_1 = require("tsyringe");
const controller_decorator_1 = require("../decorators/controller.decorator");
const api_response_dto_1 = require("../dto/common/api-response.dto");
const user_service_1 = require("../services/user.service");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async findAll(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            if (req.query.page || req.query.limit) {
                const result = await this.userService.findWithPagination(page, limit);
                return api_response_dto_1.PaginatedResponseDto.paginated(res, result.users, result.total, result.page, result.limit, "Users retrieved successfully");
            }
            const users = await this.userService.findAll();
            return api_response_dto_1.ApiResponseDto.success(res, users, "Users retrieved successfully");
        }
        catch (error) {
            return api_response_dto_1.ApiResponseDto.error(res, "Failed to retrieve users", res.statusCode);
        }
    }
    async findById(req, res) {
        try {
            const id = req.params.id;
            if (!id) {
                res.status(400);
                return api_response_dto_1.ApiResponseDto.error(res, "Invalid user ID");
            }
            const user = await this.userService.findById(id);
            if (!user) {
                res.status(404);
                return api_response_dto_1.ApiResponseDto.warning(res, "User not found");
            }
            return api_response_dto_1.ApiResponseDto.success(res, user, "User retrieved successfully");
        }
        catch (error) {
            return api_response_dto_1.ApiResponseDto.error(res, "Failed to retrieve user", res.statusCode);
        }
    }
    async create(req, res) {
        try {
            const createUserDto = req.body;
            const user = await this.userService.create(createUserDto);
            return api_response_dto_1.ApiResponseDto.success(res, user, "User created successfully", res.statusCode);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Failed to create user";
            return api_response_dto_1.ApiResponseDto.error(res, message, res.statusCode);
        }
    }
    async update(req, res) {
        try {
            const id = req.params.id;
            if (!id) {
                res.status(400);
                return api_response_dto_1.ApiResponseDto.warning(res, "Invalid user ID", res.statusCode);
            }
            const updateUserDto = req.body;
            const user = await this.userService.update(id, updateUserDto);
            if (!user) {
                res.status(404);
                return api_response_dto_1.ApiResponseDto.warning(res, "User not found", res.statusCode);
            }
            return api_response_dto_1.ApiResponseDto.success(res, user, "User updated successfully", res.statusCode);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Failed to update user";
            res.status(400);
            return api_response_dto_1.ApiResponseDto.error(res, message, res.statusCode);
        }
    }
    async remove(req, res) {
        try {
            const id = req.params.id;
            if (!id) {
                res.status(400);
                return api_response_dto_1.ApiResponseDto.warning(res, "Invalid user ID", res.statusCode);
            }
            const deleted = await this.userService.delete(id);
            if (!deleted) {
                res.status(404);
                return api_response_dto_1.ApiResponseDto.warning(res, "User not found", res.statusCode);
            }
            return api_response_dto_1.ApiResponseDto.success(res, "User deleted successfully");
        }
        catch (error) {
            res.status(500);
            return api_response_dto_1.ApiResponseDto.error(res, "Failed to delete user", res.statusCode);
        }
    }
};
exports.UserController = UserController;
__decorate([
    (0, controller_decorator_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findAll", null);
__decorate([
    (0, controller_decorator_1.Get)("/:id"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findById", null);
__decorate([
    (0, controller_decorator_1.Post)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "create", null);
__decorate([
    (0, controller_decorator_1.Put)("/:id"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "update", null);
__decorate([
    (0, controller_decorator_1.Delete)("/:id"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "remove", null);
exports.UserController = UserController = __decorate([
    (0, controller_decorator_1.Controller)("/user"),
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
