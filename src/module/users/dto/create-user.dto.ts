import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ErrorCode } from 'src/config/constantError';
import { CustomException } from 'src/http-exception-fillter/customException';

export class CreateUserDto {
  @IsNotEmpty()
  @MinLength(6)
  name: string;
  @IsNotEmpty()
  gmail: string;
  @IsNotEmpty()
  @MinLength(6, {
    message: (validationArguments) => {
      throw new CustomException(
        ErrorCode.PASSWORD_TOO_SHORT,
        validationArguments.constraints,
      );
    },
  })
  password: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  idRoles: string[];
}
