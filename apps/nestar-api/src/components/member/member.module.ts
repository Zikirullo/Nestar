import { Module } from '@nestjs/common';
import { MemberResolver } from './member.resolver';
import { MemberService } from './member.service';
import { MongooseModule } from '@nestjs/mongoose';
import MemberSchema from '../../schemas/Member.model';
import { AuthModule } from '../auth/auth.module';
import { ViewModule } from '../views/view.module';
import { LikesModule } from '../likes/likes.module';
import FollowSchema from '../../schemas/Follow.model';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: 'Member', schema: MemberSchema }]),
		MongooseModule.forFeature([{ name: 'Follow', schema: FollowSchema }]),
		AuthModule,
		ViewModule,
		LikesModule,
	],

	providers: [MemberResolver, MemberService],
	exports: [MemberService],
})
export class MemberModule {}
