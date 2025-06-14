import { inject, injectable } from "tsyringe";
import { CreateUserDto } from "../dto/user/create-user.dto";
import { UpdateUserDto } from "../dto/user/update-user.dto";
import { UserResponseDto } from "../dto/user/user-response.dto";
import { UserMapper } from "../mappers/user.mapper";
import { IUserRepository } from "../repositories/interfaces/user-repository.interface";
import { UserRepository } from "../repositories/user.repository";

@injectable()
export class UserService {
  constructor(
    @inject(UserRepository) private userRepository: IUserRepository,
    private userMapper: UserMapper
  ) {}

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.findAll();
    return UserMapper.toResponseDtoArray(users);
  }

  async findById(id: number): Promise<UserResponseDto | null> {
    const user = await this.userRepository.findById(id);
    return user ? UserMapper.toResponseDto(user) : null;
  }

  async findByEmail(email: string): Promise<UserResponseDto | null> {
    const user = await this.userRepository.findByEmail(email);
    return user ? UserMapper.toResponseDto(user) : null;
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(
      createUserDto.email
    );
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const userEntity = UserMapper.toEntity(createUserDto);
    const createdUser = await this.userRepository.create(userEntity);
    return UserMapper.toResponseDto(createdUser);
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto
  ): Promise<UserResponseDto | null> {
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      return null;
    }

    // Check email uniqueness if email is being updated
    if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
      const userWithEmail = await this.userRepository.findByEmail(
        updateUserDto.email
      );
      if (userWithEmail && userWithEmail.id !== id) {
        throw new Error("Email already in use by another user");
      }
    }

    const updatedUserEntity = UserMapper.updateEntityFromDto(
      existingUser,
      updateUserDto
    );
    const savedUser = await this.userRepository.update(updatedUserEntity);
    return UserMapper.toResponseDto(savedUser);
  }

  async delete(id: number): Promise<boolean> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      return false;
    }
    return this.userRepository.delete(id);
  }

  async findWithPagination(
    page: number = 1,
    limit: number = 10
  ): Promise<{
    users: UserResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const [users, total] = await this.userRepository.findWithPagination(
      page,
      limit
    );

    return {
      users: UserMapper.toResponseDtoArray(users),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
