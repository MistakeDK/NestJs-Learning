import { IsNotEmpty, IsString } from 'class-validator';

export class SendMessageToRoomDTO {
  @IsNotEmpty()
  @IsString()
  room: string;
  @IsNotEmpty()
  @IsString()
  message: string;
  @IsNotEmpty()
  @IsString()
  sender: string;
}
