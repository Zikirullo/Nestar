import { Module } from '@nestjs/common';
import { MemberModule } from './member/member.module';
import { PropertyModule } from './property/property.module';
import { AuthModule } from './auth/auth.module';
import { CommentModule } from './comment/comment.module';
import { LikesModule } from './likes/likes.module';
import { ViewModule } from './views/view.module';
import { FollowModule } from './follow/follow.module';
import { BoardArticleModule } from './board-article/board-article.module';
import { ViewService } from './views/view.service';

@Module({
	imports: [
		MemberModule,
		AuthModule,
		PropertyModule,
		BoardArticleModule,
		FollowModule,
		LikesModule,
		ViewModule,
		CommentModule,
	],
})
export class ComponentsModule {}
