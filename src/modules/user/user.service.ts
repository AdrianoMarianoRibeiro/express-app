import { inject, injectable } from 'tsyringe';
import { AppException } from '../../shared/exceptions';
import { PageOptionsDto } from '../../shared/pagination/page-options.dto';
import { PageDto } from '../../shared/pagination/page.dto';
import { GetAllOptions } from '../../shared/repositories';
import { BcryptService } from '../bcrypt/bcrypt.service';
import { CreateUserDto, UpdateUserDto } from './dtos';
import { IUserResponse } from './interfaces';
import { UserMapper } from './mappers';
import { UserEntity } from './user.entity';
import { UserRepository } from './user.repository';

@injectable()
export class UserService {
  constructor(
    @inject(UserRepository) private repository: UserRepository,
    private readonly bcryptService: BcryptService,
  ) {}

  findAll(
    pageOptionsDto: PageOptionsDto,
    options: GetAllOptions<UserEntity>,
  ): Promise<PageDto<IUserResponse>> {
    return this.repository.getAll(pageOptionsDto, options);
  }

  async find(id: string): Promise<IUserResponse | null> {
    const user = await this.repository.find(id);
    return user ? UserMapper.toResponse(user) : null;
  }

  async findByEmail(email: string): Promise<IUserResponse | null> {
    const user = await this.repository.findOneWhere({ email });
    return user ? UserMapper.toResponse(user) : null;
  }

  async create(createUserDto: CreateUserDto): Promise<IUserResponse> {
    const existingUser = await this.repository.findOneWhere({
      email: createUserDto.email,
    });
    if (existingUser) {
      throw new AppException({
        email: 'Email already in use by another user',
      });
    }

    createUserDto.password = await this.bcryptService.encrypt(
      createUserDto.password,
    );

    const userEntity = UserMapper.toEntity(createUserDto);
    const createdUser = await this.repository.create(userEntity);
    return UserMapper.toResponse(createdUser);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<IUserResponse | null> {
    const existingUser = await this.repository.find(id);
    if (!existingUser) {
      return null;
    }

    // Check email uniqueness if email is being updated
    if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
      const userWithEmail = await this.repository.findOneWhere({
        email: updateUserDto.email,
      });
      if (userWithEmail && userWithEmail.id !== id) {
        throw new AppException({
          email: 'Email already in use by another user',
        });
      }
    }

    const updatedUserEntity = UserMapper.updateEntityFromDto(
      existingUser,
      updateUserDto,
    );
    const savedUser = await this.repository.update(updatedUserEntity);
    return UserMapper.toResponse(savedUser);
  }

  async delete(id: string): Promise<boolean> {
    const user = await this.repository.find(id);
    if (!user) {
      return false;
    }
    const result = await this.repository.delete(id);
    return result.affected > 0;
  }

  async softDelete(id: string): Promise<boolean> {
    const user = await this.repository.find(id);
    if (!user) {
      return false;
    }
    const result = await this.repository.softDelete(id);
    return result.affected > 0;
  }

  async findWithPagination(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    users: IUserResponse[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const [users, total] = await this.repository.findWithPagination(
      page,
      limit,
    );

    return {
      users: UserMapper.toResponseArray(users),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
