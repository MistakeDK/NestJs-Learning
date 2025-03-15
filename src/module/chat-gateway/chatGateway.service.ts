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
import { JoinPrivateRoomDTO } from './dto/JoinPrivateRoomDTO';
import { SendMessageToRoomDTO } from './dto/SendMessageToRoomDTO';

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
    idUsersReceive: string[],
  ) {
    const { sender } = message;
    idUsersReceive.forEach((item) => {
      if (this.users.has(item) && this.users.get(item) !== sender) {
        this.server
          .to(this.users.get(item) as string)
          .emit('receiveMessage', message);
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
        this.users.delete(idUser);
      }
    });
  }
}
