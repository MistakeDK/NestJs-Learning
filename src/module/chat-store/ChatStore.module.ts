import { Module } from '@nestjs/common';
import { ChatStoreController } from './ChatStore.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Conversation,
  ConversationSchema,
} from './entities/conversation.schema';
import { Message, MessageSchema } from './entities/message.schema';
import { ChatStoreService } from './chatStore.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { ChatGateWay } from '../chat-gateway/chatGateway.service';

@Module({
  controllers: [ChatStoreController],
  imports: [
    MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [ChatStoreService, ChatGateWay],
})
export class ChatStoreModule {}
