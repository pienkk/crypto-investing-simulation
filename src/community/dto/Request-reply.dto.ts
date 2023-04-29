import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

// 댓글 생성 요청 DTO
export class RequestCreateReplyDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '코멘트',
    required: true,
    example: '댓글입니다.',
  })
  readonly comment: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: '포스트Id', required: true, example: 20 })
  readonly postId: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: '원 댓글ID', required: false, example: 5 })
  readonly replyId?: number;
}

// 댓글 수정 요청 DTO
export class RequestUpdateReplyDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '코멘트',
    required: true,
    example: '수정 댓글입니다.',
  })
  readonly comment: string;
}

// 댓글 삭제 요청 DTO
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
