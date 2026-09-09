import { Logger } from '@nestjs/common';
import { OnGatewayInit, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Server } from 'ws';

@WebSocketGateway({ tranports: ['websocket'], secure: false })
export class SocketGateway implements OnGatewayInit {
	private logger: Logger = new Logger('SocketEventsGateway');
	private summeryClient: number = 0;

	public afterInit(server: Server) {
		this.logger.log(`\n\n WebSocket Server Initialized total ${this.summeryClient} \n`);
	}
	handleConnection(client: WebSocket, ...args: any[]) {
		this.summeryClient++;
		this.logger.log(`\n\n== Client connected total ${this.summeryClient} ==\n`);
	}
	handleDisconnect(client: WebSocket) {
		this.summeryClient--;
		this.logger.log(`\n\n== Client disconnected left total ${this.summeryClient} ==\n`);
	}
	@SubscribeMessage('message')
	handleMessage(client: any, payload: any): string {
		return 'Hello world!';
	}
}
