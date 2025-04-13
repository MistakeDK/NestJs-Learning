import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { eMessageType } from 'src/config/messageType.enum';

export class CreateMessageDTO {
  @IsString()
  @IsOptional()
  conversationId: string;
  @IsString()
  @IsNotEmpty()
  sender: string;
  @IsString()
  @IsNotEmpty()
  content: string;
  @IsOptional()
  @IsEnum(eMessageType)
  type: string;
  @IsOptional()
  receiver: string;
}
