import {
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

@UsePipes(
  new ValidationPipe({ exceptionFactory: (error) => new WsException(error) }),
)
@UseFilters(WebSocketExceptionFilter)
@UseGuards(authenticationWsGuard)
@WebSocketGateway(8002, { cors: '*' })
export class ChatGateWay implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  private users = new Map<string, string>();

  @UseGuards(AuthorizationWsGuard)
  @Permissions([ePermission.CAN_CHAT])
  @SubscribeMessage('storeIdUser')
  handleStoreUser(
    @MessageBody() storeIdDTO: StoreIdUserDTO,
    @ConnectedSocket() client: Socket,
  ): WsResponse {
    this.users.set(storeIdDTO.id, client.id);

    return {
      event: 'store-reply',
      data: 'store success',
    };
  }

  @SubscribeMessage('joinPrivateRoom')
  handleJoinPrivateRoom(
    @MessageBody() listUsers: JoinPrivateRoomDTO,
    @ConnectedSocket() client: Socket,
  ) {
    const room = listUsers.userIds.join(',');
    client.join(room);
    console.log('room', room);
    listUsers.userIds.forEach((user) => {
      this.server.sockets.sockets
        .get(this.users.get(user) as string)
        ?.join(room);
    });
  }

  @SubscribeMessage('sendPrivateMessage')
  handleSendPrivateMessage(@MessageBody() data: SendMessageToRoomDTO) {
    console.log('data send', data);
    this.server.sockets.to(data.room).emit('receivePrivateMessage', data);
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
