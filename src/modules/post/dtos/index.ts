import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '../../../decorators';
import { UserEntity } from '../../user/user.entity';
import { UserResponseDto } from '../../user/dtos';

export class CreatePostDto {
  @ApiProperty({
    description: 'The unique identifier of the Post',
    type: 'string',
    example: 'uuid-string',
    required: false,
  })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({
    description: 'The name of the Post',
    type: 'string',
    example: 'John Doe',
    minLength: 1,
  })
  @IsNotEmpty()
  @IsString()
  post: string;

  @ApiProperty({
    description: 'The ID user of the Post',
    type: 'string',
    format: 'string',
    example: 'uuid-string',
  })
  @IsNotEmpty()
  userId: string;

  @IsOptional()
  userEntity?: UserEntity;
}

export class UpdatePostDto {
  @ApiProperty({
    description: 'The unique identifier of the Post',
    type: 'string',
    example: 'uuid-string',
  })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({
    description: 'The name of the Post',
    type: 'string',
    example: 'John Doe Updated',
    required: false,
  })
  @IsOptional()
  @IsString()
  post?: string;

  @ApiProperty({
    description: 'The ID user of the Post',
    type: 'string',
    format: 'string',
    example: 'uuid-string',
  })
  @IsOptional()
  userId?: string;

  @IsOptional()
  userEntity?: UserEntity;
}

export class PostResponseDto {
  @ApiProperty({
    description: 'Post ID',
    type: 'string',
    example: 'uuid-do-post',
  })
  id: string;

  @ApiProperty({
    description: 'Post content',
    type: 'string',
    example: 'Este é um post de exemplo',
  })
  post: string;

  @ApiProperty({
    description: 'User who created the post',
    type: () => UserResponseDto, // Referência ao DTO do usuário
    required: false,
  })
  userEntity?: UserResponseDto;

  @ApiProperty({
    description: 'Creation date',
    type: 'string',
    format: 'date-time',
    example: '2025-06-17T10:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Update date',
    type: 'string',
    format: 'date-time',
    example: '2025-06-17T10:00:00.000Z',
  })
  updatedAt: Date;
}
