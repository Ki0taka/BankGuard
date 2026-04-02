import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'notifications',
})
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('NotificationGateway');

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinNotifications')
  handleJoinRoom(client: Socket, userId: string) {
    const roomName = `user_${userId}`;
    client.join(roomName);
    this.logger.log(`User ${userId} joined room ${roomName}`);
    return { event: 'joined', data: roomName };
  }

  sendNotificationToUser(userId: string, notification: any) {
    const roomName = `user_${userId}`;
    this.server.to(roomName).emit('newNotification', notification);
    this.logger.log(`Notification sent to user ${userId} in room ${roomName}`);
  }
}
