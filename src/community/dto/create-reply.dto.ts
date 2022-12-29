import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateReplyDto {
  @IsString()
  @ApiProperty()
  readonly comment: string;

  @IsNumber()
  @ApiProperty()
  readonly userId: number;

  @IsNumber()
  @ApiProperty()
  readonly postId: number;
}
