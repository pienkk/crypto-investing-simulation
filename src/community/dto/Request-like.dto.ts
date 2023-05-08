import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';

// 좋아요/싫어요 생성 요청 DTO
export class RequestCreateLikeDto {
  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    description: '좋아요/싫어요 구분 ex) true = 좋아요, false = 싫어요',
    required: true,
  })
  isLike: boolean;
}

/**
 * 좋아요/싫어요 삭제 요청 DTO
 */
export class RequestDeleteLikeDto {
  @IsArray()
  @IsNumber({ allowNaN: false }, { each: true })
  @IsNotEmpty()
  @ApiProperty({
    description: '좋아요 삭제할 게시글 id 리스트',
    required: true,
    example: [1, 2],
  })
  postId: number[];
}
