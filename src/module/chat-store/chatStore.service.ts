import { plainToInstance } from 'class-transformer';
import { CacheAppService } from './../cache/cacheApp.service';
import { ChatGateWay } from './../chat-gateway/chatGateway.service';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Conversation } from './entities/conversation.schema';
import { Model, Types } from 'mongoose';
import { Message } from './entities/message.schema';
import { CreateConversationDTO } from './dto/createConversationDTO';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { In, Repository } from 'typeorm';
import { CustomException } from 'src/http-exception-fillter/customException';
import { ErrorCode } from 'src/config/constantError';
import { IQuerryPage } from 'src/pipe/querry-page.pipe';
import { CreateMessageDTO } from './dto/createMessageDTO';
import { formatCacheKey } from 'src/utils/commom';
import { eKeyCache } from 'src/config/keyCache.enum';

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

  async getOrCreateConversation(firstUser: string, secondUser: string) {
    let isNew = false;
    let conversation = await this.conversationModel.findOne({
      participants: { $all: [firstUser, secondUser], $size: 2 },
    });

    if (!conversation) {
      const userSenderPromise = this.userRepository.findOneByOrFail({
        id: firstUser,
      });

      const userReceiverPromise = this.userRepository.findOneByOrFail({
        id: secondUser,
      });

      const [userSender, userReceivere] = await Promise.all([
        userSenderPromise,
        userReceiverPromise,
      ]);

      const newConversation = new this.conversationModel({
        nameParticipants: [userSender.name, userReceivere.name],
        participants: [userSender.id, userReceivere.id],
      });
      conversation = await newConversation.save();
      isNew = true;
    }

    return {
      _id: conversation._id,
      participants: conversation.participants,
      isNew,
    };
  }

  async getAllConversationByIdUser(idUser: string, querry: IQuerryPage) {
    const filter = {
      participants: { $in: [idUser] },
      lastMessage: {
        $exists: true,
        $ne: null,
      },
    };

    const total = await this.conversationModel.countDocuments(filter);
    const listConversation = await this.conversationModel
      .find(filter)
      .limit(querry.limit)
      .skip((querry.page - 1) * querry.limit)
      .sort({ updatedAt: 'desc' })
      .where()
      .lean();

    return { listConversation, total };
  }

  async getDetailConversation(idConversation: string, querry: IQuerryPage) {
    const messageDetail = await this.cacheAppService.getOrSet(
      formatCacheKey(eKeyCache.DETAIL_CONVERSATION, {
        conversationId: idConversation,
      }),
      () => {
        return this.messageModel
          .find({
            conversationId: new Types.ObjectId(idConversation),
          })
          .sort({
            createdAt: 'desc',
          });
      },
      3,
    );
    return messageDetail;
  }

  async sendMessage(createMessageDTO: CreateMessageDTO) {
    const { conversationId, sender, content, receiver } = createMessageDTO;

    const user = await this.cacheAppService.getOrSet(
      formatCacheKey(eKeyCache.USER, {
        userId: sender,
      }),
      () => this.userRepository.findOneBy({ id: sender }),
      20,
    );

    if (!user) {
      throw new CustomException(ErrorCode.USER_NOT_EXIST);
    }

    const conversation = conversationId
      ? await this.getConversationById(conversationId)
      : await this.getOrCreateConversation(sender, receiver);

    if (!conversation) {
      throw new CustomException(ErrorCode.UN_HANDLE_EXCEPTION);
    }

    const newMessage = new this.messageModel({
      ...createMessageDTO,
      conversationId: conversation._id,
    });
    await newMessage.save();

    await this.conversationModel.findByIdAndUpdate(conversation?._id, {
      lastMessage: { idUser: sender, message: content, username: user.name },
    });

    this.chatGateWay.handleSendPrivateMessage(
      createMessageDTO,
      conversation.participants,
    );
    return {
      _id: newMessage._id,
      conversationId: conversation._id.toString(),
      content: content,
    };
  }

  // Helper

  private async getConversationById(conversationId: string) {
    const conversation = await this.conversationModel.findById(conversationId);
    if (!conversation) {
      throw new CustomException(ErrorCode.CONVERSATION_IS_NOT_EXIST);
    }
    return conversation;
  }
}
