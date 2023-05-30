import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ErrorHandlerModule } from '../error-handler/error-handler.module';
import { Review } from './entities/review.entity';
import { ReviewController } from './review.controller';
import { reviewErrorMessages } from './review.error';
import { ReviewService } from './review.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Review]),
    ErrorHandlerModule.register(reviewErrorMessages),
  ],
  providers: [ReviewService],
  exports: [ReviewService],
  controllers: [ReviewController],
})
export class ReviewModule {}
