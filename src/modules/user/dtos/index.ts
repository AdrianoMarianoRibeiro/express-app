import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '../../../decorators';

export class CreateUserDto {
  @ApiProperty({
    description: 'The unique identifier of the user',
    type: 'string',
    example: 'uuid-string',
    required: false,
  })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({
    description: 'The name of the user',
    type: 'string',
    example: 'John Doe',
    minLength: 1,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The email address of the user',
    type: 'string',
    format: 'email',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password for the user account',
    type: 'string',
    example: 'SecurePassword123!',
    minLength: 4,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  password: string;
}

export class UpdateUserDto {
  @ApiProperty({
    description: 'The unique identifier of the user',
    type: 'string',
    example: 'uuid-string',
  })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({
    description: 'The name of the user',
    type: 'string',
    example: 'John Doe Updated',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'The email address of the user',
    type: 'string',
    format: 'email',
    example: 'john.updated@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'User status',
    type: 'boolean',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}

export class UserResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the user',
    type: 'string', // Corrigido para string para bater com sua interface
    example: 'uuid-string',
  })
  id: string;

  @ApiProperty({
    description: 'The name of the user',
    type: 'string',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: 'The email address of the user',
    type: 'string',
    format: 'email',
    example: 'john.doe@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'User status',
    type: 'boolean',
    example: true,
  })
  status: boolean;

  @ApiProperty({
    description: 'When the user was created',
    type: 'string',
    format: 'date-time',
    example: '2023-12-01T10:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'When the user was last updated',
    type: 'string',
    format: 'date-time',
    example: '2023-12-01T10:00:00Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'When the user was deleted',
    type: 'string',
    format: 'date-time',
    example: '2023-12-01T10:00:00Z',
    required: false,
  })
  deletedAt?: Date;
}
