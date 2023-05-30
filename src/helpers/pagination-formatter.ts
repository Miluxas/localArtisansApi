import { Between, In, Like, Repository } from 'typeorm';
import { ListBody } from '../common/listBody.type';
//filters and sort by given body params
export const findAndPaginate = async <Entity>(
  repository: Repository<Entity>,
  listBody: ListBody,
  filterQuery,
  convertor = (item: Entity) => <any>item,
  textSearchFields: string[] = [],
  relations: string[] = [],
) => {
  const take = listBody.take ?? 10;
  const skip = listBody.skip ?? 0;
  let queryObject;
  if (listBody.filters) {
    Object.assign(filterQuery, stdFilterForTypeOrm(listBody.filters));
  }
  if (
    textSearchFields.length > 0 &&
    listBody.searchQuery &&
    listBody.searchQuery.length > 0
  ) {
    queryObject = textSearchFields.map((field) => ({
      [field]: Like(`%${listBody.searchQuery}%`),
      ...filterQuery,
    }));
  } else {
    queryObject = filterQuery;
  }
  const sort = listBody.sort ?? { createdAt: 'desc' };
  const result = await repository.findAndCount({
    where: queryObject,
    relations,
    order: sort,
    take: take,
    skip: skip,
  });
  const number = result[1];
  const items = result[0];
  const totalPages = Math.floor(number / take) + (number % take > 0 ? 1 : 0);
  const currentPage = Math.floor(skip / take) + 1;
  const itemCount = currentPage < totalPages ? take : number % take;
  return {
    items: items.map(convertor),
    pagination: {
      itemCount,
      totalItems: number,
      itemsPerPage: take,
      totalPages,
      currentPage,
      sort,
      filters: listBody.filters,
      searchQuery: listBody.searchQuery,
    },
  };
};

function stdFilterForTypeOrm(filter: any) {
  const result = {};
  Object.keys(filter).forEach((key) => {
    if (Array.isArray(filter[key])) {
      if (key.endsWith('.#period')) {
        Object.assign(result, {
          [key.replace('.#period', '')]: Between(
            filter[key][0],
            filter[key][1],
          ),
        });
      } else {
        Object.assign(result, { [key]: In(filter[key]) });
      }
    } else if (
      Object.keys(filter[key]).length > 0 &&
      typeof filter[key] !== 'string'
    ) {
      Object.assign(result, { [key]: stdFilterForTypeOrm(filter[key]) });
    } else {
      Object.assign(result, { [key]: filter[key] });
    }
  });
  return result;
}

export const paginateList = <Entity>(list: Entity[]) => {
  return {
    items: list,
    pagination: {
      itemCount: list.length,
      totalItems: list.length,
      itemsPerPage: list.length,
      totalPages: 1,
      currentPage: 1,
      sort: {},
      filters: {},
      searchQuery: '',
    },
  };
};
