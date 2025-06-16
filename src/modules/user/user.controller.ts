import { injectable } from 'tsyringe';
import {
  ApiTags,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '../../decorators';
import { CreateUserDto, UpdateUserDto } from './dtos';
import { IUserResponse } from './interfaces';
import { UserService } from './user.service';

@injectable()
@Controller('/user')
@ApiTags('User')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<any> {
    const pageNum = parseInt(page || '1');
    const limitNum = parseInt(limit || '10');
    return await this.service.findWithPagination(pageNum, limitNum);
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
