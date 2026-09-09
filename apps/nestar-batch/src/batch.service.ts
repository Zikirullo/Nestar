import { Injectable } from '@nestjs/common';

@Injectable()
export class BatchService {
	public async batchRollback(): Promise<void> {
		console.log('executed');
	}
	public async batchTopProperties(): Promise<void> {
		console.log('executed');
	}
	public async batchTopAgents(): Promise<void> {
		console.log('executed');
	}

	getHello(): string {
		return 'Hello World from batch!';
	}
}
