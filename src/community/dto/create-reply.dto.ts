import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

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

export class RequestDeleteReplyDto {
  @IsNotEmpty()
  @IsArray()
  @ApiProperty({
    description: '삭제할 댓글 id리스트',
    required: true,
    example: [1, 2],
  })
  readonly replyId: number[];
}
