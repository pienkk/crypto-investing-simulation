import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateReplyDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '코멘트', required: true })
  readonly comment: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: '포스트ID', required: true })
  readonly postId: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: '원 댓글ID', required: false })
  readonly replyId?: number;
}

export class UpdateReplyDto {
  @IsString()
  @ApiProperty({ description: '코멘트', required: true })
  readonly comment: string;
}
