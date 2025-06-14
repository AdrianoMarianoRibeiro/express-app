import { injectable, inject } from "tsyringe";
import { UserRepository } from "./user.repository";

@injectable()
export class UserService {
  constructor(@inject(UserRepository) private repository: UserRepository) {}

  findAll(): Promise<any[]> {
    return this.repository.findAll();
  }

  async findById(id: number): Promise<UserResponseDto | null> {
    const user = await this.userRepository.findById(id);
    return user ? this.userMapper.toResponseDto(user) : null;
  }

  async findByEmail(email: string): Promise<UserResponseDto | null> {
    const user = await this.userRepository.findByEmail(email);
    return user ? this.userMapper.toResponseDto(user) : null;
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(
      createUserDto.email
    );
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const userEntity = this.userMapper.toEntity(createUserDto);
    const createdUser = await this.userRepository.create(userEntity);
    return this.userMapper.toResponseDto(createdUser);
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

    const updatedUserEntity = this.userMapper.updateEntityFromDto(
      existingUser,
      updateUserDto
    );
    const savedUser = await this.userRepository.update(updatedUserEntity);
    return this.userMapper.toResponseDto(savedUser);
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
      users: this.userMapper.toResponseDtoArray(users),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
