import { DataSource } from "typeorm";
import { User } from "../entities/user.entity";
import { IUserRepository } from "./interfaces/user-repository.interface";
export declare class UserRepository implements IUserRepository {
    private dataSource;
    private repository;
    constructor(dataSource: DataSource);
    findAll(): Promise<User[]>;
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    create(user: User): Promise<User>;
    update(user: User): Promise<User>;
    delete(id: string): Promise<boolean>;
    count(): Promise<number>;
    findWithPagination(page: number, limit: number): Promise<[User[], number]>;
}
