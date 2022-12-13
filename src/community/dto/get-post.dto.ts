import { IsNumber } from 'class-validator';

export class GetPostListsDto {
  @IsNumber()
  readonly page: number;

  @IsNumber() // user 기능 생성후 삭제
  readonly number: number;
}
