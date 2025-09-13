import {
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*', // Allow all origins for dev; restrict in prod
  },
})
export class NotificationsGateway {
  @WebSocketServer()
  server!: Server;

  notifyCardAdded(card: any) {
    this.server.emit('card-added', card); // Frontend listens to this event
  }
}