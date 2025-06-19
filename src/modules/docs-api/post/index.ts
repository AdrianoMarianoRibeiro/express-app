import { SwaggerModuleConfig } from '../../../decorators/swagger-module.decorator';
import { PaginationResponseDto } from '../../../shared/libs/pagination';
import { CreatePostDto, PostResponseDto, UpdatePostDto } from '../../post/dtos';

export const PostSwaggerConfig: SwaggerModuleConfig = {
  tag: 'Posts',
  endpoints: {
    findAll: {
      summary: 'Get all Posts',
      description: 'Retrieve a paginated list of Posts',
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
        {
          name: 'orderBy',
          description: 'Field to order by',
          type: 'string',
          required: false,
        },
        {
          name: 'searchTerm',
          description: 'Search term',
          type: 'string',
          required: false,
        },
      ],
      responses: [
        {
          status: 200,
          description: 'Posts retrieved successfully',
          type: PaginationResponseDto, // Use o DTO paginado
        },
        { status: 400, description: 'Invalid pagination parameters' },
      ],
    },
    create: {
      summary: 'Create Post',
      description: 'Create a new Post',
      body: { description: 'Post data', type: CreatePostDto, required: true },
      responses: [
        {
          status: 201,
          description: 'Post created successfully',
          type: PostResponseDto,
        },
        { status: 400, description: 'Invalid Post data' },
      ],
    },
    find: {
      summary: 'Get Post by ID',
      description: 'Retrieve a specific Post by their ID',
      params: [{ name: 'id', description: 'Post ID', type: 'string', required: true }],
      responses: [
        { status: 200, description: 'Post found', type: PostResponseDto },
        { status: 404, description: 'Post not found' },
        { status: 400, description: 'Invalid Post ID' },
      ],
    },
    update: {
      summary: 'Update Post',
      description: 'Update an existing Post',
      params: [{ name: 'id', description: 'Post ID', type: 'string', required: true }],
      body: {
        description: 'Updated Post data',
        type: UpdatePostDto,
        required: true,
      },
      responses: [
        {
          status: 200,
          description: 'Post updated successfully',
          type: PostResponseDto,
        },
        { status: 404, description: 'Post not found' },
        { status: 409, description: 'Email already in use' },
        { status: 400, description: 'Invalid Post data' },
      ],
    },
    delete: {
      summary: 'Delete Post',
      description: 'Delete a Post account',
      params: [{ name: 'id', description: 'Post ID', type: 'string', required: true }],
      responses: [
        { status: 200, description: 'Post deleted successfully' },
        { status: 404, description: 'Post not found' },
        { status: 400, description: 'Invalid Post ID' },
      ],
    },
    // changePassword: {
    //   summary: 'Change Post password',
    //   description: 'Change password for a specific Post',
    //   params: [
    //     { name: 'id', description: 'Post ID', type: 'string', required: true },
    //   ],
    //   body: {
    //     description: 'Password change data',
    //     type: ChangePasswordDto,
    //     required: true,
    //   },
    //   responses: [
    //     { status: 200, description: 'Password changed successfully' },
    //     { status: 400, description: 'Invalid current password' },
    //     { status: 404, description: 'Post not found' },
    //   ],
    // },
    // validatePost: {
    //   summary: 'Validate Post credentials',
    //   description: 'Validate Post email and password for authentication',
    //   body: {
    //     description: 'Post credentials',
    //     type: 'object', // Você pode criar um LoginDto específico
    //     required: true,
    //   },
    //   responses: [
    //     {
    //       status: 200,
    //       description: 'Credentials are valid',
    //       type: PostResponseDto,
    //     },
    //     { status: 401, description: 'Invalid credentials' },
    //     { status: 400, description: 'Missing credentials' },
    //   ],
    // },
  },
};
