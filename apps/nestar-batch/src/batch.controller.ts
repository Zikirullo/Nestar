import { Controller, Get, Logger } from '@nestjs/common';
import { BatchService } from './batch.service';
import { Cron, Interval, Timeout } from '@nestjs/schedule';
import { BATCH_ROLLBACK, BATCH_TOP_AGENTS, BATCH_TOP_PROPERTIES } from './libs/config';

@Controller()
export class BatchController {
	private Logger: Logger = new Logger('batchController');
	constructor(private readonly BatchService: BatchService) {}

	@Timeout(1000)
	handleTimeout() {
		this.Logger.debug("Batch server's ready");
	}

	@Cron('00 00 01 * * *', { name: BATCH_ROLLBACK })
	public async batchRollback() {
		try {
			this.Logger['context'] = BATCH_ROLLBACK;
			this.Logger.debug('EXECUTED');
			await this.BatchService.batchRollback();
		} catch (err) {
			this.Logger.error(err);
		}
	}

	@Cron('20 00 01 * * *', { name: BATCH_TOP_PROPERTIES })
	public async batchTopProperties() {
		try {
			this.Logger['context'] = BATCH_TOP_PROPERTIES;
			this.Logger.debug('EXECUTED');
			await this.BatchService.batchTopProperties();
		} catch (err) {
			this.Logger.error(err);
		}
	}

	@Cron('40 00 01 * * *', { name: BATCH_TOP_AGENTS })
	public async batchTopAgents() {
		try {
			this.Logger['context'] = BATCH_TOP_AGENTS;
			this.Logger.debug('EXECUTED');
			await this.BatchService.batchTopAgents();
		} catch (err) {
			this.Logger.error(err);
		}
	}

	@Get()
	getHello(): string {
		return this.BatchService.getHello();
	}
}
