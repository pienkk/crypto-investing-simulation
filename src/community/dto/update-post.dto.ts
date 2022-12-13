import { IsNumber, IsString } from 'class-validator';

export class UpdatePostDto {
  @IsString()
  readonly title?: string;

  @IsString()
  readonly description?: string;
}
