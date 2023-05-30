import {  Inject, Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { InjectRepository } from "@nestjs/typeorm";
import { Cache } from "cache-manager";
import * as crypto from "crypto";
import { Repository } from "typeorm";
import { ListBody } from "../common/listBody.type";
import { PaginatedList } from "../common/paginated-list.type";
import { findAndPaginate } from "../helpers/pagination-formatter";
import { User } from "../user/entities/user.entity";
import { ProductError } from "./product.error";
import { Product } from "./entities/product.entity";
import { IProduct } from "./interfaces";
import { CACHE_MANAGER } from "@nestjs/cache-manager";

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
  ) {}

  public async productList(listBody: ListBody): Promise<PaginatedList<any>> {
    const queryObject = listBody.filters ? listBody.filters : {};
    return findAndPaginate(
      this.productRepository,
      listBody,
      queryObject,
      (item) => item,
      ["title"]
    );
  }

  public async myProductList(
    userId: number
  ): Promise<Product[]> {
    return this.productRepository.findBy({artisan:{id:userId}})
  }

  public async update(id: number, newValue: IProduct): Promise<Product> {
    const product = await this.productRepository.findOneBy({
      id,
    });
    if (!product) {
      throw new Error(ProductError.PRODUCT_NOT_FOUND);
    }
    Object.assign(product, newValue);
    await this.productRepository.save(product);

    return product;
  }

  public async getDetail(id: number): Promise<Product> {
    const product = await this.productRepository.findOneBy({
      id,
    });
    if (!product) throw new Error(ProductError.PRODUCT_NOT_FOUND);
    return product;
  }

}
