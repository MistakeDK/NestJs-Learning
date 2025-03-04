import { Module } from '@nestjs/common';
import { ChatGateWay } from './chatGateway.service';

@Module({
  providers: [ChatGateWay],
})
export class ChatGatewayModule {}
