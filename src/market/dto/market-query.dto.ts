import { IsNumber, IsOptional, IsString } from 'class-validator';

export class MarketQueryDto {
  @IsString()
  @IsOptional()
  readonly filter: string = 'name';

  @IsString()
  @IsOptional()
  readonly order: string = 'ASC';

  @IsNumber()
  @IsOptional()
  readonly page: number;

  @IsNumber()
  @IsOptional()
  readonly number: number;
}
