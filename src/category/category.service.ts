import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ListBody } from "../common/listBody.type";
import { PaginatedList } from "../common/paginated-list.type";
import { findAndPaginate } from "../helpers/pagination-formatter";
import { CategoryError } from "./category.error";
import { Category } from "./entities/category.entity";
import { ICategory } from "./interfaces";

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>
  ) {}

  public async categoryList(listBody: ListBody): Promise<PaginatedList<any>> {
    const queryObject = listBody.filters ? listBody.filters : {};
    return findAndPaginate(
      this.categoryRepository,
      listBody,
      queryObject,
      (item) => item,
      ["title"]
    );
  }

  public async create(newCategory: ICategory): Promise<Category> {
    const category = new Category();
    category.title = newCategory.title;
    category.isActive = newCategory.isActive;
    if (newCategory.parentId) {
      const parentCategory = await this.categoryRepository.findOneBy({
        id: newCategory.parentId,
      });
      category.parent = parentCategory;
    }
    await this.categoryRepository.insert(category);

    return category;
  }

  public async setActivation(id: number, active: boolean): Promise<boolean> {
    const category = await this.categoryRepository.update(
      { id },
      { isActive: active }
    );
    if (!category.affected) {
      throw new Error(CategoryError.CATEGORY_NOT_FOUND);
    }
    return true;
  }

  public async update(id: number, newValue: ICategory): Promise<Category> {
    const category = await this.categoryRepository.findOneBy({
      id,
    });
    if (!category) {
      throw new Error(CategoryError.CATEGORY_NOT_FOUND);
    }
    Object.assign(category, newValue);
    if (newValue.parentId) {
      const parentCategory = await this.categoryRepository.findOneBy({
        id: newValue.parentId,
      });
      category.parent = parentCategory;
    }
    await this.categoryRepository.save(category);

    return category;
  }

  public async getDetail(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ["children"],
    });
    if (!category) throw new Error(CategoryError.CATEGORY_NOT_FOUND);
    return category;
  }
}
