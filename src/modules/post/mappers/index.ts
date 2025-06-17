import { DateUtil, UUIDUtil } from '../../../shared/utils/helpers';
import { CreatePostDto, PostResponseDto, UpdatePostDto } from '../dtos';
import { PostEntity } from '../post.entity';

export abstract class PostMapper {
  static toEntity(createPostDto: CreatePostDto): PostEntity {
    return {
      id: createPostDto.id ?? UUIDUtil.make(),
      post: createPostDto.post,
      userEntity: createPostDto.userEntity,
    } as PostEntity;
  }

  static toResponse(postEntity: PostEntity): PostResponseDto {
    return {
      id: postEntity.id,
      post: postEntity.post,
      user: {
        id: postEntity.userEntity.id,
        name: postEntity.userEntity.name,
        email: postEntity.userEntity.email,
        status: postEntity.userEntity.status,
        createdAt: postEntity.userEntity.createdAt,
        updatedAt: postEntity.userEntity.updatedAt,
      },
      createdAt: postEntity.createdAt,
      updatedAt: postEntity.updatedAt,
    } as PostResponseDto;
  }

  static toResponseArray(users: PostEntity[]): PostResponseDto[] {
    return users.map((user) => this.toResponse(user));
  }

  static updateEntityFromDto(
    postEntity: PostEntity,
    updateUserDto: UpdatePostDto,
  ): PostEntity {
    if (updateUserDto.post !== undefined) {
      postEntity.post = updateUserDto.post;
    }
    if (updateUserDto.userEntity !== undefined) {
      postEntity.userEntity = updateUserDto.userEntity;
    }

    postEntity.updatedAt = DateUtil.now();

    return postEntity;
  }
}
