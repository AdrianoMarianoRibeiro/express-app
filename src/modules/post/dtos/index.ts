import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
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
    description: 'The user of the Post',
    type: 'string',
    format: 'email',
    example: 'john.doe@example.com',
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
    description: 'The user of the Post',
    type: 'string',
    format: 'email',
    example: 'john.updated@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  userId?: string;

  @IsOptional()
  userEntity?: UserEntity;
}

export class PostResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the Post',
    type: 'string', // Corrigido para string para bater com sua interface
    example: 'uuid-string',
  })
  id: string;

  @ApiProperty({
    description: 'The name of the Post',
    type: 'string',
    example: 'John Doe',
  })
  post: string;

  @ApiProperty({
    description: 'The user of the Post',
    type: 'string',
    format: 'email',
    example: 'john.doe@example.com',
  })
  user: UserResponseDto;

  @ApiProperty({
    description: 'When the Post was created',
    type: 'string',
    format: 'date-time',
    example: '2023-12-01T10:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'When the Post was last updated',
    type: 'string',
    format: 'date-time',
    example: '2023-12-01T10:00:00Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'When the Post was deleted',
    type: 'string',
    format: 'date-time',
    example: '2023-12-01T10:00:00Z',
    required: false,
  })
  deletedAt?: Date;
}
