// src/game/game.gateway.ts
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*', // Allow connections from all origins (you can adjust it for specific domains)
    methods: ['GET', 'POST'], // Allow only specific methods if needed
    allowedHeaders: ['Content-Type'], // Add any allowed headers if necessary
    credentials: true, // Allow credentials if needed
  },
})
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private server: Server;

  afterInit(server: Server) {
    this.server = server;
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('playerMoved')
  handlePlayerMove(
    client: Socket,
    @MessageBody() data: { x: number; y: number },
  ) {
    if (!client) {
      console.error('Client is undefined');
      return;
    }

    // Log the client to check its structure
    console.log('Client:', client);

    // Broadcast player movement to other players
    this.server.emit('playerMove', { id: client.id, ...data });
  }
}
