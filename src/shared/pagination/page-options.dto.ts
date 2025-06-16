import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { OrderEnum } from './order.enum';
import { ApiProperty } from '../../decorators';

export class PageOptionsDto {
  @ApiProperty({
    description: 'Order direction',
    enum: OrderEnum,
    default: OrderEnum.ASC,
  })
  @IsEnum(OrderEnum)
  @IsOptional()
  readonly order?: OrderEnum = OrderEnum.ASC;

  @ApiProperty({
    description: 'Page number',
    type: 'number',
    minimum: 1,
    default: 1,
    example: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    type: 'number',
    minimum: 1,
    maximum: 50,
    default: 10,
    example: 10,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  readonly take: number = 10;

  get skip(): number {
    return (this.page - 1) * this.take;
  }
}
