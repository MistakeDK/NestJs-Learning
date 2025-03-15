import { IsEnum, isEnum, IsNotEmpty, IsString } from 'class-validator';
import { eMessageType } from 'src/config/messageType.enum';

export class sendMessageDTO {
  @IsNotEmpty()
  @IsString()
  conversationId: string;
  @IsNotEmpty()
  @IsString()
  sender: string;
  @IsNotEmpty()
  @IsString()
  content: string;
  @IsEnum(eMessageType)
  type: eMessageType;
}
