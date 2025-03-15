import { IsArray, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateConversationDTO {
  @IsArray()
  @IsNotEmpty({ each: true })
  @IsUUID(undefined, { each: true })
  participants: string[];
}
