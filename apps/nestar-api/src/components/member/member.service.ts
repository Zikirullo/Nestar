import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Member } from '../../libs/dto/member/member';
import { MemberInput } from '../../libs/dto/member/member.input';

@Injectable()
export class MemberService {
	constructor(@InjectModel('Member') private readonly memberModel: Model<Member>) {}

	public async signup(input: MemberInput): Promise<Member> {
		// TODO -> Hash password
		try {
			return await this.memberModel.create(input);
			// TODO -> Authentication
		} catch (err) {
			console.log('ERROR => Service.model', err);
			throw new BadRequestException(err);
		}
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
