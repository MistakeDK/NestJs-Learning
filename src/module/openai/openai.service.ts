import { ConfigService } from '@nestjs/config';
import { CreateChatCompletionDTO } from './dto/sendMessageDTO';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources';
import { Injectable } from '@nestjs/common';
@Injectable()
export class OpenaiService {
  constructor(private readonly openai: OpenAI) {}
  async sendMessage(createChatCompletionDTO: CreateChatCompletionDTO) {
    if (!this.openai) {
      throw new Error('OpenAI instance is not initialized');
    }
    return await this.openai.chat.completions.create({
      messages: createChatCompletionDTO.message as ChatCompletionMessageParam[],
      model: 'gpt-4o-mini',
    });
  }
}
