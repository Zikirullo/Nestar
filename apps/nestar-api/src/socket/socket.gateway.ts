import { Logger } from '@nestjs/common';
import { OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'ws';
import * as WebSocket from 'ws';
import { AuthService } from '../components/auth/auth.service';
import { Member } from '../libs/dto/member/member';
import * as url from 'url';
import { AuthMember } from '../components/auth/decorators/authMember.decorator';

interface MessagePayload {
	event: string;
	text: string;
	memberData: Member;
}

interface InfoPayload {
	event: string;
	totalClients: number;
	memberData: Member;
	action: string;
}

@WebSocketGateway({ tranports: ['websocket'], secure: false })
export class SocketGateway implements OnGatewayInit {
	private logger: Logger = new Logger('SocketEventsGateway');
	private summeryClient: number = 0;
	private clientAuthMap = new Map<WebSocket, Member>();
	private messageList: MessagePayload[] = [];

	constructor(private authService: AuthService) {}

	@WebSocketServer()
	server: Server;

	public afterInit(server: Server) {
		this.logger.verbose(`\n\n WebSocket Server Initialized & total [${this.summeryClient}]  \n`);
	}

	private async retrieveAuth(req: any): Promise<Member> {
		try {
			const parseUrl = url.parse(req.url, true);
			const { token } = parseUrl.query;
			console.log('TOKEN->', token);
			return await this.authService.verifyToken(token as string);
		} catch (err) {
			console.log('retrieveAuth ERROR', err);
		}
	}
	public async handleConnection(client: WebSocket, req: any) {
		const authMember = await this.retrieveAuth(req);
		this.summeryClient++;

		this.clientAuthMap.set(client, authMember);
		const clientNick: string = authMember?.memberNick ?? 'Guest';

		this.logger.verbose(`\n\n==  Connection [${clientNick} connected] & total [${this.summeryClient}] ==\n`);
		const infoMeg: InfoPayload = {
			event: 'info',
			totalClients: this.summeryClient,
			memberData: authMember,
			action: 'joined',
		};
		this.emitMessage(infoMeg);
		client.send(JSON.stringify({ event: 'getMessages', list: this.messageList }));
	}
	public handleDisconnect(client: WebSocket) {
		const authMember = this.clientAuthMap.get(client);
		this.summeryClient--;
		this.clientAuthMap.delete(client);
		this.clientAuthMap.set(client, authMember);
		const clientNick: string = authMember?.memberNick ?? 'Guest';

		this.logger.verbose(`\n\n==  Disconnection [${clientNick}] left us & total [${this.summeryClient}] ==\n`);

		const infoMeg: InfoPayload = {
			event: 'info',
			totalClients: this.summeryClient,
			memberData: authMember,
			action: 'left',
		};
		this.emitMessage(infoMeg);
		this.broadcastMessage(client, infoMeg);
	}
	@SubscribeMessage('message')
	public async handleMessage(client: any, payload: any): Promise<void> {
		const authMember = this.clientAuthMap.get(client);
		const newMessage: MessagePayload = { event: 'message', text: payload, memberData: authMember };

		const clientNick: string = authMember?.memberNick ?? 'Guest';

		this.logger.verbose(`NEW MESSAGE [${clientNick}] ${payload}`);
		this.messageList.push(newMessage);
		if (this.messageList.length > 5) this.messageList.splice(0, this.messageList.length - 5);

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

/** 
  MESSAGE TARGETING: 
  1. CLIENT (only clients)
  2. BROADCASTING (except client)
  3. EMIT (all client)
**/
