import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateReplyDto {
  @IsString()
  @ApiProperty({ description: '코멘트', required: true })
  readonly comment: string;

  @IsNumber()
  @ApiProperty({ description: '포스트ID', required: true })
  readonly postId: number;
}

export class UpdateReplyDto {
  @IsString()
  @ApiProperty({ description: '코멘트', required: true })
  readonly comment: string;
}
