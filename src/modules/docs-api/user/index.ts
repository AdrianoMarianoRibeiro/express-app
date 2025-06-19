import { SwaggerModuleConfig } from '../../../decorators/swagger-module.decorator';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from '../../user/dtos';

export const UserSwaggerConfig: SwaggerModuleConfig = {
  tag: 'Users',
  endpoints: {
    findAll: {
      summary: 'Get all users',
      description: 'Retrieve a paginated list of users',
      queries: [
        {
          name: 'page',
          description: 'Page number',
          type: 'number',
          required: false,
        },
        {
          name: 'limit',
          description: 'Items per page',
          type: 'number',
          required: false,
        },
      ],
      responses: [
        {
          status: 200,
          description: 'Users retrieved successfully',
          type: UserResponseDto,
          isArray: true,
        },
        { status: 400, description: 'Invalid pagination parameters' },
      ],
    },
    create: {
      summary: 'Create user',
      description: 'Create a new user account',
      body: { description: 'User data', type: CreateUserDto, required: true },
      responses: [
        {
          status: 201,
          description: 'User created successfully',
          type: UserResponseDto,
        },
        { status: 409, description: 'Email already exists' },
        { status: 400, description: 'Invalid user data' },
      ],
    },
    find: {
      summary: 'Get user by ID',
      description: 'Retrieve a specific user by their ID',
      params: [{ name: 'id', description: 'User ID', type: 'string', required: true }],
      responses: [
        { status: 200, description: 'User found', type: UserResponseDto },
        { status: 404, description: 'User not found' },
        { status: 400, description: 'Invalid user ID' },
      ],
    },
    update: {
      summary: 'Update user',
      description: 'Update an existing user',
      params: [{ name: 'id', description: 'User ID', type: 'string', required: true }],
      body: {
        description: 'Updated user data',
        type: UpdateUserDto,
        required: true,
      },
      responses: [
        {
          status: 200,
          description: 'User updated successfully',
          type: UserResponseDto,
        },
        { status: 404, description: 'User not found' },
        { status: 409, description: 'Email already in use' },
        { status: 400, description: 'Invalid user data' },
      ],
    },
    delete: {
      summary: 'Delete user',
      description: 'Delete a user account',
      params: [{ name: 'id', description: 'User ID', type: 'string', required: true }],
      responses: [
        { status: 200, description: 'User deleted successfully' },
        { status: 404, description: 'User not found' },
        { status: 400, description: 'Invalid user ID' },
      ],
    },
    // changePassword: {
    //   summary: 'Change user password',
    //   description: 'Change password for a specific user',
    //   params: [
    //     { name: 'id', description: 'User ID', type: 'string', required: true },
    //   ],
    //   body: {
    //     description: 'Password change data',
    //     type: ChangePasswordDto,
    //     required: true,
    //   },
    //   responses: [
    //     { status: 200, description: 'Password changed successfully' },
    //     { status: 400, description: 'Invalid current password' },
    //     { status: 404, description: 'User not found' },
    //   ],
    // },
    // validateUser: {
    //   summary: 'Validate user credentials',
    //   description: 'Validate user email and password for authentication',
    //   body: {
    //     description: 'User credentials',
    //     type: 'object', // Você pode criar um LoginDto específico
    //     required: true,
    //   },
    //   responses: [
    //     {
    //       status: 200,
    //       description: 'Credentials are valid',
    //       type: UserResponseDto,
    //     },
    //     { status: 401, description: 'Invalid credentials' },
    //     { status: 400, description: 'Missing credentials' },
    //   ],
    // },
  },
};
