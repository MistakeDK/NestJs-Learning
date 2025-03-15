import { ChatGateWay } from './../chat-gateway/chatGateway.service';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Conversation } from './entities/conversation.schema';
import { Model } from 'mongoose';
import { Message } from './entities/message.schema';
import { CreateConversationDTO } from './dto/createConversationDTO';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { In, Repository } from 'typeorm';
import { CustomException } from 'src/http-exception-fillter/customException';
import { ErrorCode } from 'src/config/constantError';
import { IQuerryPage } from 'src/pipe/querry-page.pipe';
import { CreateMessageDTO } from './dto/createMessageDTO';

@Injectable()
export class ChatStoreService {
  constructor(
    @InjectModel(Conversation.name)
    private readonly conversationModel: Model<Conversation>,
    @InjectModel(Message.name) private readonly messageModel: Model<Message>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly ChatGateWay: ChatGateWay,
  ) {}
  async createConversation(createConversationDTO: CreateConversationDTO) {
    const { participants } = createConversationDTO;
    const listUser = await this.userRepository.find({
      where: {
        id: In(participants),
      },
    });
    if (listUser.length !== participants.length) {
      throw new CustomException(ErrorCode.USER_NOT_EXIST);
    }
    const createdConversation = new this.conversationModel({
      participants: participants,
    });
    return await createdConversation.save();
  }

  async getAllConversationByIdUser(id: string, querry: IQuerryPage) {
    const result = await this.conversationModel
      .find({
        participants: {
          $in: [id],
        },
      })
      .exec();
    return result;
  }

  async sendMessage(createMessageDTO: CreateMessageDTO) {
    const { conversationId } = createMessageDTO;
    const isConversationExist =
      await this.conversationModel.findById(conversationId);
    if (!isConversationExist) {
      throw new CustomException(ErrorCode.CONVERSATION_IS_NOT_EXIST);
    }
    const newMessage = new this.messageModel({ ...createMessageDTO });
    await newMessage.save();
    this.ChatGateWay.handleSendPrivateMessage(
      createMessageDTO,
      isConversationExist.participants,
    );
  }
}
