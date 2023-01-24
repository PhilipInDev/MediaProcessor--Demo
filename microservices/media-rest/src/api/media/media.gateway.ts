import {
	OnGatewayConnection,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
class MediaGateway implements OnGatewayConnection {

	@WebSocketServer()
	server: Server;

	async handleConnection(socket: Socket) {}
}

export { MediaGateway };
