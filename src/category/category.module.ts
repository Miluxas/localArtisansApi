import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ErrorHandlerModule } from '../error-handler/error-handler.module';
import { AdminCategoryController } from './admin-category.controller';
import { CategoryController } from './category.controller';
import { categoryErrorMessages } from './category.error';
import { CategoryService } from './category.service';
import { Category } from './entities/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
    ErrorHandlerModule.register(categoryErrorMessages),
  ],
  providers: [CategoryService],
  exports: [CategoryService],
  controllers: [AdminCategoryController, CategoryController],
})
export class CategoryModule {}
