import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ListBody } from "../common/listBody.type";
import { findAndPaginate } from "../helpers/pagination-formatter";
import { Product } from "../product/entities/product.entity";
import { User } from "../user/entities/user.entity";
import { Review } from "./entities/review.entity";
import { IReview } from "./interfaces";
import { ReviewError } from "./review.error";

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>
  ) {}

  public async packageReviewList(listBody: ListBody) {
    const queryObject = listBody.filters ? listBody.filters : {};
    return findAndPaginate(
      this.reviewRepository,
      listBody,
      queryObject,
      (item) => item
    );
  }

  public async create(newReview: IReview): Promise<Review> {
    let review = await this.reviewRepository.findOneBy({
      product: { id: newReview.productId },
      user: { id: newReview.userId },
    });
    if (!review) {
      review = new Review();
    }
    Object.assign(review, newReview);
    review.user = <User>{ id: newReview.userId };
    review.product = <Product>{
      id: newReview.productId,
    };

    return this.reviewRepository.findOneBy({ id: review.id });
  }

  public async delete(
    id: number,
    productId: number,
    userId: number
  ): Promise<boolean> {
    const result = await this.reviewRepository.softDelete({
      id,
      user: { id: userId },
      product: { id: productId },
    });

    if (!result.affected) {
      throw new Error(ReviewError.PACKAGE_REVIEW_NOT_FOUND);
    }

    return true;
  }

  public async update(
    id: number,
    productId: number,
    userId: number,
    content?: string,
    rate?: number
  ): Promise<Review> {
    const packageReview = await this.reviewRepository.findOneBy({
      id,
      user: { id: userId },
      product: { id: productId },
    });
    if (!packageReview) {
      throw new Error(ReviewError.PACKAGE_REVIEW_NOT_FOUND);
    }
    packageReview.content = content;
    packageReview.rate = rate;
    await this.reviewRepository.save(packageReview);
    return this.reviewRepository.findOneBy({ id: packageReview.id });
  }
}
