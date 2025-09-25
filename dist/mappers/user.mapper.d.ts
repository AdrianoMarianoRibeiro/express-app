import { User } from "../entities/user.entity";
import { CreateUserDto } from "../dto/user/create-user.dto";
import { UpdateUserDto } from "../dto/user/update-user.dto";
import { UserResponseDto } from "../dto/user/user-response.dto";
export declare abstract class UserMapper {
    static toEntity(createUserDto: CreateUserDto): User;
    static toResponseDto(user: User): UserResponseDto;
    static toResponseDtoArray(users: User[]): UserResponseDto[];
    static updateEntityFromDto(user: User, updateUserDto: UpdateUserDto): User;
}
