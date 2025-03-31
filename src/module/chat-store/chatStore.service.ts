import { plainToInstance } from 'class-transformer';
import { CacheAppService } from './../cache/cacheApp.service';
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
    private readonly chatGateWay: ChatGateWay,
    private readonly cacheAppService: CacheAppService,
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

  async getAllConversationByIdUser(idUser: string, querry: IQuerryPage) {
    const listConversation = await this.conversationModel
      .find({ participants: { $in: [idUser] } })
      .sort({ updatedAt: 'desc' })
      .lean();

    return listConversation;
  }

  async getDetailConversation(idConversation: string, querry: IQuerryPage) {
    const messageDetail = this.cacheAppService.getOrSet(
      `detailConversation:${idConversation}`,
      () => {
        return this.messageModel
          .find({
            conversationId: idConversation,
          })
          .sort({
            createdAt: 'desc',
          });
      },
      30,
    );
    return messageDetail;
  }

  async sendMessage(createMessageDTO: CreateMessageDTO) {
    const { conversationId, sender, content } = createMessageDTO;
    const user = await this.cacheAppService.getOrSet(
      `user:${sender}`,
      () => {
        return this.userRepository.findOneBy({
          id: sender,
        });
      },
      10,
    );
    if (!user) {
      throw new CustomException(ErrorCode.USER_NOT_EXIST);
    }
    const isConversationExist =
      await this.conversationModel.findById(conversationId);
    if (!isConversationExist) {
      throw new CustomException(ErrorCode.CONVERSATION_IS_NOT_EXIST);
    }
    const newMessage = new this.messageModel({ ...createMessageDTO });
    await newMessage.save();
    await this.conversationModel.findByIdAndUpdate(conversationId, {
      lastMessage: { idUser: sender, message: content, username: user.name },
    });
    this.chatGateWay.handleSendPrivateMessage(
      createMessageDTO,
      isConversationExist.participants,
    );
  }
}
