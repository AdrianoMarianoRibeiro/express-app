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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const tsyringe_1 = require("tsyringe");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../entities/user.entity");
let UserRepository = class UserRepository {
    constructor(dataSource) {
        this.dataSource = dataSource;
        this.repository = this.dataSource.getRepository(user_entity_1.User);
    }
    async findAll() {
        return this.repository.find();
    }
    async findById(id) {
        return this.repository.findOneBy({ id });
    }
    async findByEmail(email) {
        return this.repository.findOneBy({ email });
    }
    async create(user) {
        return this.repository.save(user);
    }
    async update(user) {
        return this.repository.save(user);
    }
    async delete(id) {
        const result = await this.repository.softDelete(id);
        const affectedRows = result.affected ?? 0;
        return affectedRows > 0;
    }
    async count() {
        return this.repository.count();
    }
    async findWithPagination(page, limit) {
        return this.repository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
            order: { createdAt: "DESC" },
        });
    }
};
exports.UserRepository = UserRepository;
exports.UserRepository = UserRepository = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(typeorm_1.DataSource)),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], UserRepository);
