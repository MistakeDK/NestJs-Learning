import {
  Injectable,
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayDisconnect,
  WsResponse,
  WsException,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { WebSocketExceptionFilter } from './ws-exception-fillter.filter';
import { StoreIdUserDTO } from './dto/storeIdUserDTO';

import { authenticationWsGuard } from 'src/guard/authenticationWs.guard';
import { AuthorizationWsGuard } from 'src/guard/authorizationWs.guard';
import { Permissions } from 'src/decorator/permission.decorator';
import { ePermission } from 'src/config/permission.enum';
import { CreateMessageDTO } from '../chat-store/dto/createMessageDTO';

@UsePipes(
  new ValidationPipe({ exceptionFactory: (error) => new WsException(error) }),
)
@Injectable()
@UseFilters(WebSocketExceptionFilter)
@UseGuards(authenticationWsGuard)
@WebSocketGateway(8002, { cors: '*' })
export class ChatGateWay implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  private users = new Map<string, string>();

  @Permissions([ePermission.CAN_CHAT])
  @UseGuards(AuthorizationWsGuard)
  @SubscribeMessage('storeIdUser')
  handleStoreUser(
    @MessageBody() storeIdDTO: StoreIdUserDTO,
    @ConnectedSocket() client: Socket,
  ) {
    this.users.set(storeIdDTO.id, client.id);
  }

  handleSendPrivateMessage(
    message: CreateMessageDTO,
    idUsers: string[],
    nameParticipants: string[],
    idMessage: string,
  ) {
    const { sender } = message;
    console.log(this.users);
    idUsers.forEach((item) => {
      if (this.users.has(item) && item !== sender) {
        this.server.to(this.users.get(item) as string).emit('receiveMessage', {
          ...message,
          participants: idUsers,
          nameParticipants: nameParticipants,
          _id: idMessage,
        });
      }
    });
  }

  @UseGuards(authenticationWsGuard)
  handleConnection(@ConnectedSocket() client: Socket) {
    console.log('id client has been connected', client.id);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.users.forEach((socketId, idUser) => {
      if (socketId === client.id) {
        console.log('id client has been disconnected', socketId);
        this.users.delete(idUser);
      }
    });
  }
}
