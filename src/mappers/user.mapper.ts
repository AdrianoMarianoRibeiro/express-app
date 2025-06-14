import { User } from "../entities/user.entity";
import { CreateUserDto } from "../dto/user/create-user.dto";
import { UpdateUserDto } from "../dto/user/update-user.dto";
import { UserResponseDto } from "../dto/user/user-response.dto";

export abstract class UserMapper {
  static toEntity(createUserDto: CreateUserDto): User {
    const user = new User();
    user.name = createUserDto.name;
    user.email = createUserDto.email;
    user.password = createUserDto.password;
    return user;
  }

  static toResponseDto(user: User): UserResponseDto {
    const responseDto = new UserResponseDto();
    responseDto.id = user.id;
    responseDto.email = user.email;
    responseDto.name = user.name;
    responseDto.isActive = user.isActive;
    responseDto.createdAt = user.createdAt;
    responseDto.updatedAt = user.updatedAt;
    return responseDto;
  }

  static toResponseDtoArray(users: User[]): UserResponseDto[] {
    return users.map((user) => this.toResponseDto(user));
  }

  static updateEntityFromDto(user: User, updateUserDto: UpdateUserDto): User {
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
