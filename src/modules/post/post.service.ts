import { inject, injectable } from 'tsyringe';
import { AppException } from '../../shared/exceptions';
import { PageOptionsDto } from '../../shared/pagination/page-options.dto';
import { PageDto } from '../../shared/pagination/page.dto';
import { GetAllOptions } from '../../shared/repositories';
import { UserService } from '../user/user.service';
import { CreatePostDto, PostResponseDto, UpdatePostDto } from './dtos';
import { PostMapper } from './mappers';
import { PostEntity } from './post.entity';
import { PostRepository } from './post.repository';

@injectable()
export class PostService {
  constructor(
    @inject(PostRepository) private repository: PostRepository,
    private readonly userService: UserService,
  ) {}

  findAll(
    pageOptionsDto: PageOptionsDto,
    options: GetAllOptions<PostEntity>,
  ): Promise<PageDto<PostEntity>> {
    return this.repository.getAll(pageOptionsDto, options);
  }

  async find(id: string): Promise<PostResponseDto | null> {
    const postEntity = await this.repository.find(id, ['userEntity']);
    if (!postEntity) {
      return null;
    }
    return PostMapper.toResponse(postEntity);
  }

  async create(createPostDto: CreatePostDto): Promise<PostResponseDto> {
    const userEntity = await this.userService.findById(createPostDto.userId);
    if (!userEntity) {
      throw new AppException({
        userId: 'User not found',
      });
    }
    createPostDto.userEntity = userEntity;
    const postEntity = PostMapper.toEntity(createPostDto);
    const entity = await this.repository.create(postEntity);
    return PostMapper.toResponse(entity);
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<PostResponseDto | null> {
    const existingPost = await this.repository.find(id, ['userEntity']);

    if (!existingPost) {
      return null;
    }

    const updatedUserEntity = PostMapper.updateEntityFromDto(existingPost, updatePostDto);

    const savedUser = await this.repository.update(updatedUserEntity);
    return PostMapper.toResponse(savedUser);
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
}
