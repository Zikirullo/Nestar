import { Logger } from '@nestjs/common';
import { OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'ws';
import * as WebSocket from 'ws';

interface MessagePayload {
	event: string;
	text: string;
}

interface InfoPayload {
	event: string;
	totalClients: number;
}

@WebSocketGateway({ tranports: ['websocket'], secure: false })
export class SocketGateway implements OnGatewayInit {
	private logger: Logger = new Logger('SocketEventsGateway');
	private summeryClient: number = 0;

	@WebSocketServer()
	server: Server;

	public afterInit(server: Server) {
		this.logger.verbose(`\n\n WebSocket Server Initialized & total [${this.summeryClient}]  \n`);
	}
	handleConnection(client: WebSocket, ...args: any[]) {
		this.summeryClient++;
		this.logger.verbose(`\n\n==  Connection & total [${this.summeryClient}] ==\n`);

		const infoMeg: InfoPayload = {
			event: 'info',
			totalClients: this.summeryClient,
		};
		this.emitMessage(infoMeg);
	}
	handleDisconnect(client: WebSocket) {
		this.summeryClient--;
		this.logger.verbose(`\n\n==  Disconnection & total [${this.summeryClient}] ==\n`);

		const infoMeg: InfoPayload = {
			event: 'info',
			totalClients: this.summeryClient,
		};
		this.broadcastMessage(client, infoMeg);
	}
	@SubscribeMessage('message')
	public async handleMessage(client: any, payload: any): Promise<void> {
		const newMessage: MessagePayload = { event: 'message', text: payload };

		this.logger.verbose(`NEW MESSAGE: ${payload}`);
		this.emitMessage(newMessage);
	}

	private broadcastMessage(sender: WebSocket, message: InfoPayload | MessagePayload) {
		this.server.clients.forEach((client) => {
			if ((client !== sender && client.readyState) === WebSocket.OPEN) {
				client.send(JSON.stringify(message));
			}
		});
	}

	private emitMessage(message: InfoPayload | MessagePayload) {
		this.server.clients.forEach((client) => {
			if (client.readyState === WebSocket.OPEN) {
				client.send(JSON.stringify(message));
			}
		});
	}
}
