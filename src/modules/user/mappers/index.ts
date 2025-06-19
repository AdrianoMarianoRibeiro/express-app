import { DateUtil, UUIDUtil } from '../../../shared/utils/helpers';
import { CreateUserDto, UpdateUserDto } from '../dtos';
import { IUserResponse } from '../interfaces';
import { UserEntity } from '../user.entity';

export abstract class UserMapper {
  static toEntity(createUserDto: CreateUserDto): UserEntity {
    return {
      id: createUserDto.id ?? UUIDUtil.make(),
      name: createUserDto.name,
      email: createUserDto.email,
      password: createUserDto.password,
      status: true,
    } as UserEntity;
  }

  static toResponse(userEntity: UserEntity): IUserResponse {
    return {
      id: userEntity.id,
      email: userEntity.email,
      name: userEntity.name,
      status: userEntity.status,
      createdAt: userEntity.createdAt,
      updatedAt: userEntity.updatedAt,
    } as IUserResponse;
  }

  static toResponseArray(users: UserEntity[]): IUserResponse[] {
    return users.map((user) => this.toResponse(user));
  }

  static updateEntityFromDto(user: UserEntity, updateUserDto: UpdateUserDto): UserEntity {
    if (updateUserDto.name !== undefined) {
      user.name = updateUserDto.name;
    }
    if (updateUserDto.email !== undefined) {
      user.email = updateUserDto.email;
    }
    if (updateUserDto.status !== undefined) {
      user.status = updateUserDto.status;
    }

    user.updatedAt = DateUtil.now();

    return user;
  }
}
