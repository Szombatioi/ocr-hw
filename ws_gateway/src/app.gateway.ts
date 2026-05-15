/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@Injectable()
@WebSocketGateway({ cors: { origin: '*' } })
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket) {
    // Socket.io handles it automatically
    // console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    // Socket.io handles it automatically
    // console.log(`Client disconnected: ${client.id}`);
  }

  broadcast(event: string, payload: unknown) {
    this.server.emit(event, payload);
  }
}
