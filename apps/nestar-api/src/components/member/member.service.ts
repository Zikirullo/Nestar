import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class MemberService {
	constructor(@InjectModel('Member') private readonly memberModel: Model<null>) {}

	public async signup(): Promise<string> {
		return 'signup service executed';
	}
	public async login(): Promise<string> {
		return 'login service executed';
	}
	public async updateMember(): Promise<string> {
		return 'updateMember service executed';
	}
	public async getMember(): Promise<string> {
		return 'getMember service executed';
	}
}
