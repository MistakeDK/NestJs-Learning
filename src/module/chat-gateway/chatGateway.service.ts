import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { generateUUID } from 'src/utils/commom';

interface IBodyJoinPrivateRoom {
  userIds: string[];
}

interface IBodySendMessageToRoom {
  room: string;
  message: string;
  sender: string;
}

@WebSocketGateway(8002, { cors: '*' })
export class ChatGateWay implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  private users = new Map<string, string>();

  @SubscribeMessage('storeIdUser')
  handleStoreUser(
    @MessageBody() id: string,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('idUser', id);
    this.users.set(id, client.id);
  }

  @SubscribeMessage('joinPrivateRoom')
  handleJoinPrivateRoom(
    @MessageBody() listUsers: IBodyJoinPrivateRoom,
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
  handleSendPrivateMessage(@MessageBody() data: IBodySendMessageToRoom) {
    console.log('data send', data);
    this.server.sockets.to(data.room).emit('receivePrivateMessage', data);
  }

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
