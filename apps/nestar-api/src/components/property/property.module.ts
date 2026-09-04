import { Module } from '@nestjs/common';
import { PropertyResolver } from './property.resolver';
import PropertyService from './property.service';
import { MongooseModule } from '@nestjs/mongoose';
import PropertySchema from '../../schemas/Property.model';
import { AuthModule } from '../auth/auth.module';
import { ViewModule } from '../views/view.module';
import { MemberModule } from '../member/member.module';
import { LikesModule } from '../likes/likes.module';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: 'Property', schema: PropertySchema }]),
		AuthModule,
		ViewModule,
		MemberModule,
		LikesModule,
	],
	providers: [PropertyResolver, PropertyService],
	exports: [PropertyService],
})
export class PropertyModule {}
