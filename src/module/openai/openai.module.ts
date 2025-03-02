import { Module } from '@nestjs/common';
import { OpenaiController } from './openai.controller';
import { OpenaiService } from './openai.service';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [OpenaiController],
  providers: [
    OpenaiService,
    {
      provide: OpenAI,
      useFactory: (configSerivce: ConfigService) => {
        return new OpenAI({
          apiKey: configSerivce.getOrThrow<string>('SECRET_KEY_OPEN_API'),
        });
      },
      inject: [ConfigService],
    },
  ],
})
export class OpenaiModule {}
