import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdatePostDto {
  @IsString()
  @IsOptional()
  readonly title: string;

  @IsString()
  @IsOptional()
  readonly description: string;

  @IsNumber() // jwt 생성후 삭제
  readonly userId: number;
}
