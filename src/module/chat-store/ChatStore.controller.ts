import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UsePipes,
} from '@nestjs/common';
import { ChatStoreService } from './chatStore.service';
import { CreateConversationDTO } from './dto/createConversationDTO';
import { IsPublic } from 'src/decorator/public.decorator';
import { IQuerryPage, QuerryPagePipe } from 'src/pipe/querry-page.pipe';
import { CreateMessageDTO } from './dto/createMessageDTO';

@Controller('/chat')
export class ChatStoreController {
  constructor(private readonly chatStoreSerive: ChatStoreService) {}
  @Post()
  @IsPublic()
  createConversation(@Body() createConversationDTO: CreateConversationDTO) {
    return this.chatStoreSerive.createConversation(createConversationDTO);
  }

  @Get('/:id')
  getConversationById(
    @Param('id') idUser: string,
    @Query(QuerryPagePipe) querry: IQuerryPage,
  ) {
    return this.chatStoreSerive.getAllConversationByIdUser(idUser, querry);
  }

  @Get('/detail/:id')
  getDetailConversation(
    @Param('id') idConversation: string,
    @Query(QuerryPagePipe) query: IQuerryPage,
  ) {
    return this.chatStoreSerive.getDetailConversation(idConversation, query);
  }

  @Post('sendMessage')
  sendMessage(@Body() createMessageDTO: CreateMessageDTO) {
    return this.chatStoreSerive.sendMessage(createMessageDTO);
  }
}
