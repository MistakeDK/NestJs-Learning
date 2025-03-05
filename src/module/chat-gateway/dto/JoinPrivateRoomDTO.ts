import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

export class JoinPrivateRoomDTO {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  userIds: string[];
}
