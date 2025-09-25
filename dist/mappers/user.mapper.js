"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMapper = void 0;
const user_entity_1 = require("../entities/user.entity");
const user_response_dto_1 = require("../dto/user/user-response.dto");
class UserMapper {
    static toEntity(createUserDto) {
        const user = new user_entity_1.User();
        user.name = createUserDto.name;
        user.email = createUserDto.email;
        user.password = createUserDto.password;
        return user;
    }
    static toResponseDto(user) {
        const responseDto = new user_response_dto_1.UserResponseDto();
        responseDto.id = user.id;
        responseDto.email = user.email;
        responseDto.name = user.name;
        responseDto.isActive = user.isActive;
        responseDto.createdAt = user.createdAt;
        responseDto.updatedAt = user.updatedAt;
        return responseDto;
    }
    static toResponseDtoArray(users) {
        return users.map((user) => this.toResponseDto(user));
    }
    static updateEntityFromDto(user, updateUserDto) {
        if (updateUserDto.name !== undefined) {
            user.name = updateUserDto.name;
        }
        if (updateUserDto.email !== undefined) {
            user.email = updateUserDto.email;
        }
        if (updateUserDto.password !== undefined) {
            user.password = updateUserDto.password;
        }
        if (updateUserDto.isActive !== undefined) {
            user.isActive = updateUserDto.isActive;
        }
        return user;
    }
}
exports.UserMapper = UserMapper;
