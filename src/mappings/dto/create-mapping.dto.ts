import { IsString, IsNotEmpty } from 'class-validator';

export class CreateMappingDto {
  @IsString()
  @IsNotEmpty()
  id1!: string;

  @IsString()
  @IsNotEmpty()
  id2!: string;
}
