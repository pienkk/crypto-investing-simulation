import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdatePostDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly title: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly description: string;

  @IsNumber() // jwt 생성후 삭제
  @ApiProperty()
  readonly userId: number;
}
