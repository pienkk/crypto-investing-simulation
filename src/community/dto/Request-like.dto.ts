import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

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
