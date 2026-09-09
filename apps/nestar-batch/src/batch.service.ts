import { Injectable } from '@nestjs/common';
import { PropertyModule } from '../../nestar-api/src/components/property/property.module';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Property } from '../../nestar-api/src/libs/dto/property/property';
import { PropertyStatus } from '../../nestar-api/src/libs/enums/property.enum';
import { Member } from '../../nestar-api/src/libs/dto/member/member';
import { MemberStatus, MemberType } from '../../nestar-api/src/libs/enums/member.enum';

@Injectable()
export class BatchService {
	constructor(
		@InjectModel('Property') private readonly propertyModel: Model<Property>,
		@InjectModel('Member') private readonly memberModel: Model<Member>,
	) {}

	public async batchRollback(): Promise<void> {
		await this.propertyModel.updateMany({ propertyStatus: PropertyStatus.ACTIVE }, { propertyRank: 0 }).exec();
		await this.memberModel
			.updateMany(
				{
					memberStatus: MemberStatus.ACTIVE,
					memberType: MemberType.AGENT,
				},
				{ memberRank: 0 },
			)
			.exec();
	}
	public async batchTopProperties(): Promise<void> {
		const properties: Property[] = await this.propertyModel
			.find({
				propertyStatus: PropertyStatus.ACTIVE,
				propertyRank: 0,
			})
			.exec();
		const promiseList = properties.map(async (ele: Property) => {
			const { _id, propertyLikes, propertyViews } = ele;
			const rank = propertyLikes * 2 + propertyViews * 1;
			return await this.propertyModel.findByIdAndUpdate(_id, { propertyRank: rank });
		});
		await Promise.all(promiseList);
	}

	public async batchTopAgents(): Promise<void> {
		const agents: Member[] = await this.memberModel
			.find({ memberStatus: MemberStatus.ACTIVE, memberType: MemberType.AGENT, memberRank: 0 })
			.exec();
		const promiseList = agents.map(async (ele: Member) => {
			const { _id, memberProperties, memberArticles, memberLikes, memberViews } = ele;
			const rank = memberProperties * 5 + memberArticles * 3 + memberLikes * 2 + memberViews * 1;
			return await this.memberModel.findByIdAndUpdate(_id, { memberRank: rank });
		});
		await Promise.all(promiseList);
	}

	getHello(): string {
		return 'Hello World from batch!';
	}
}
