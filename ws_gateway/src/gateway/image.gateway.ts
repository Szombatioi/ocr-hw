import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class ImageGateway {
  @WebSocketServer()
  server: Server;

  broadcastImage(image: unknown): void {
    this.server.emit('image.ready', image);
  }
}
