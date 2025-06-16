import { injectable } from 'tsyringe';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '../../decorators';
import { SwaggerModule } from '../../decorators/swagger-module.decorator';
import { PageOptionsDto } from '../../shared/pagination/page-options.dto';
import { PageDto } from '../../shared/pagination/page.dto';
import { GetAllOptions } from '../../shared/repositories';
import { CreateUserDto, UpdateUserDto } from './dtos';
import { IUserResponse } from './interfaces';
import { UserSwaggerConfig } from './swagger';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@injectable()
@Controller('/user')
@SwaggerModule(UserSwaggerConfig)
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get()
  async findAll(
    @Query() pageOptionsDto: PageOptionsDto,
    @Query('orderBy') orderByField?: string,
    @Query('searchTerm') searchTerm?: string,
  ): Promise<PageDto<IUserResponse>> {
    const options: GetAllOptions<UserEntity> = {
      orderByField: orderByField as keyof UserEntity,
      searchTerm,
      searchFields: ['name', 'email', 'status'],
      filters: { status: true },
      relations: [],
      excludeFields: ['password'],
    };

    return this.service.findAll(pageOptionsDto, options);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<IUserResponse> {
    return this.service.create(createUserDto);
  }

  @Get(':id')
  find(@Param('id') id: string) {
    return this.service.find(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.service.update(id, updateUserDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.softDelete(id);
  }
}
