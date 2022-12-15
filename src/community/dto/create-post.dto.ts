import { IsNumber, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  readonly title: string;

  @IsString()
  readonly description: string;

  @IsNumber() // user 기능 생성후 삭제
  readonly userId: number;
}
