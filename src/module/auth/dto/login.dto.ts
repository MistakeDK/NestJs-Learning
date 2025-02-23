import { IsEmail, IsNotEmpty } from 'class-validator';
export class LoginDTO {
  @IsEmail()
  gmail: string;
  @IsNotEmpty()
  password: string;
}
