import { IsNumber, IsString } from 'class-validator';

export class CreateReplyDto {
  @IsString()
  readonly comment: string;

  @IsNumber()
  readonly userId: number;

  @IsNumber()
  readonly postId: number;
}
