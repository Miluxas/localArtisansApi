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
import { OrderError } from "./order.error";
import { Order } from "./entities/order.entity";
import { IOrder } from "./interfaces";
import { CACHE_MANAGER } from "@nestjs/cache-manager";

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
  ) {}

  public async orderList(listBody: ListBody): Promise<PaginatedList<any>> {
    const queryObject = listBody.filters ? listBody.filters : {};
    return findAndPaginate(
      this.orderRepository,
      listBody,
      queryObject,
      (item) => item,
      ["title"]
    );
  }

  public async myOrderList(
    userId: number
  ): Promise<Order[]> {
    return this.orderRepository.findBy({customer:{id:userId}})
  }

  public async update(id: number, newValue: IOrder): Promise<Order> {
    const order = await this.orderRepository.findOneBy({
      id,
    });
    if (!order) {
      throw new Error(OrderError.ORDER_NOT_FOUND);
    }
    Object.assign(order, newValue);
    await this.orderRepository.save(order);

    return order;
  }

  public async getDetail(id: number): Promise<Order> {
    const order = await this.orderRepository.findOneBy({
      id,
    });
    if (!order) throw new Error(OrderError.ORDER_NOT_FOUND);
    return order;
  }

}
