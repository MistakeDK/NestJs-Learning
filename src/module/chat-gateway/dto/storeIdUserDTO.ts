import { IsNotEmpty, IsString } from 'class-validator';

export class StoreIdUserDTO {
  @IsString()
  @IsNotEmpty()
  id: string;
}
