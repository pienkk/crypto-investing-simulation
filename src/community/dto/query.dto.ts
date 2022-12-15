import { IsNumber, IsOptional, IsString } from 'class-validator';

export class QueryDto {
  @IsNumber()
  @IsOptional()
  readonly page: number = 1;

  @IsNumber()
  @IsOptional()
  readonly number: number = 10;

  @IsString()
  @IsOptional()
  readonly title?: string = '';
}
