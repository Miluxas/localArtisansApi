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
    return this.productRepository.findBy({owner:{id:userId}})
  }

  public async register(title: string, userId: number): Promise<Product> {
    const product = new Product();
    product.owner = <User>{ id: userId };
    product.title = title;
    product.isActive = true;
    product.publicKey = crypto.randomBytes(16).toString("hex");
    product.privateKey = crypto
      .randomBytes(256)
      .toString("hex")
      .substring(0, 255);
    await this.productRepository.insert(product);

    return product;
  }

  public async init(
    publicKey: string,
    authHash: string,
    abi: any
  ): Promise<string> {
    const product = await this.productRepository.findOne({
      where: { publicKey },
      select: ["privateKey"],
    });
    if (product.privateKey.localeCompare(authHash)) {
      throw new Error(ProductError.PRODUCT_NOT_FOUND);
    }
    await this.productRepository
      .update({ id: product.id }, { abi })
      .catch(console.error);
    return product.publicKey;
  }

  public async auth(publicKey: string, authHash: string): Promise<string> {
    const product = await this.productRepository.findOne({
      where: { publicKey },
      select: ["privateKey"],
    });
    if (product.privateKey.localeCompare(authHash)) {
      throw new Error(ProductError.PRODUCT_NOT_FOUND);
    }
    const token = crypto.randomBytes(32).toString("hex");
    await this.cacheManager.set<String>(`socket:${token}`, publicKey, {
      ttl: 0,
    });
    return token;
  }

  public async setActivation(id: number, active: boolean): Promise<boolean> {
    const product = await this.productRepository.update(
      { id },
      { isActive: active }
    );
    if (!product.affected) {
      throw new Error(ProductError.PRODUCT_NOT_FOUND);
    }
    return true;
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
