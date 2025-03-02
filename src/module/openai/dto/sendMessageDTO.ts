import { Type } from 'class-transformer';
import {
  IS_STRING,
  IsNotEmpty,
  IsString,
  IsArray,
  ValidateNested,
} from 'class-validator';

export class CreateChatCompletionDTO {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChatCompletionMessageDTO)
  message: ChatCompletionMessageDTO[];
}

export class ChatCompletionMessageDTO {
  @IsString()
  @IsNotEmpty()
  role: string;
  @IsString()
  @IsNotEmpty()
  content: string;
}
