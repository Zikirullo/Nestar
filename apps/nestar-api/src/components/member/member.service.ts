import { Injectable } from '@nestjs/common';

@Injectable()
export class MemberService {
	public async signup(): Promise<string> {
		return 'signup servvice executed';
	}
	public async login(): Promise<string> {
		return 'login servvice executed';
	}
	public async updateMember(): Promise<string> {
		return 'updateMember servvice executed';
	}
	public async getMember(): Promise<string> {
		return 'getMember servvice executed';
	}
}
