import { IsPublic } from 'src/decorator/public.decorator';
import { CreateChatCompletionDTO } from './dto/sendMessageDTO';
import { OpenaiService } from './openai.service';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('openai')
export class OpenaiController {
  constructor(private readonly openaiService: OpenaiService) {}
  @IsPublic()
  @Post()
  sendMessage(@Body() createChatCompletionDTO: CreateChatCompletionDTO) {
    return this.openaiService.sendMessage(createChatCompletionDTO);
  }
}
