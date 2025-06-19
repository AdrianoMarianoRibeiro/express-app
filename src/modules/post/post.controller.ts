import { injectable } from 'tsyringe';
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '../../decorators';
import { SwaggerModule } from '../../decorators/swagger-module.decorator';
import { PageOptionsDto } from '../../shared/pagination/page-options.dto';
import { PageDto } from '../../shared/pagination/page.dto';
import { GetAllOptions } from '../../shared/repositories';
import { PostSwaggerConfig } from '../docs-api/post';
import { CreatePostDto, PostResponseDto } from './dtos';
import { PostEntity } from './post.entity';
import { PostService } from './post.service';

@injectable()
@Controller('/post')
@SwaggerModule(PostSwaggerConfig)
export class PostController {
  constructor(private readonly service: PostService) {}

  @Get()
  async findAll(
    @Query() pageOptionsDto: PageOptionsDto,
    @Query('orderBy') orderByField?: string,
    @Query('searchTerm') searchTerm?: string,
  ): Promise<PageDto<PostEntity>> {
    const options: GetAllOptions<PostEntity> = {
      orderByField: orderByField as keyof PostEntity,
      searchTerm,
      searchFields: ['post', 'userEntity'],
      filters: {},
      relations: ['userEntity'],
      excludeFields: [],
      relationSelects: {},
      excludeRelationFields: {
        userEntity: ['password'], // Excluir password do userEntity
      },
    };

    return this.service.findAll(pageOptionsDto, options);
  }

  @Post()
  create(@Body() createUserDto: CreatePostDto): Promise<PostResponseDto> {
    return this.service.create(createUserDto);
  }

  @Get(':id')
  find(@Param('id') id: string) {
    return this.service.find(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: PostResponseDto) {
    return this.service.update(id, updateUserDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.softDelete(id);
  }
}
