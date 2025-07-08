import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '../../../decorators';

export class AuthDto {
  @ApiProperty({
    description: 'The email address of the user',
    type: 'string',
    format: 'email',
    example: 'john.doe@example.com',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @ApiProperty({
    description: 'The password for the user account',
    type: 'string',
    example: 'SecurePassword123!',
    minLength: 4,
  })
  @IsNotEmpty()
  @IsString({ message: 'Password must be a string' })
  @MinLength(4, { message: 'Password must be at least 4 characters long' })
  password: string;
}

export class AuthResponseDto {
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
