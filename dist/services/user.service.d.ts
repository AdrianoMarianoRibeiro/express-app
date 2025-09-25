import { CreateUserDto } from "../dto/user/create-user.dto";
import { UpdateUserDto } from "../dto/user/update-user.dto";
import { UserResponseDto } from "../dto/user/user-response.dto";
import { UserMapper } from "../mappers/user.mapper";
import { IUserRepository } from "../repositories/interfaces/user-repository.interface";
export declare class UserService {
    private userRepository;
    private userMapper;
    constructor(userRepository: IUserRepository, userMapper: UserMapper);
    findAll(): Promise<UserResponseDto[]>;
    findById(id: string): Promise<UserResponseDto | null>;
    findByEmail(email: string): Promise<UserResponseDto | null>;
    create(createUserDto: CreateUserDto): Promise<UserResponseDto>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto | null>;
    delete(id: string): Promise<boolean>;
    findWithPagination(page?: number, limit?: number): Promise<{
        users: UserResponseDto[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
}
