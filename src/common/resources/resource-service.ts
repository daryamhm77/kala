import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, PopulateOptions } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { ResourceInterface } from '../interfaces/resource.interface';
import { PaginateQueryDTO } from '../dto/paginate-query.dto';
type SelectOptions =
  | string
  | string[]
  | Record<string, number | boolean | object>;
type ResourceServiceOptions = {
  [Property in keyof Omit<ResourceInterface, 'create' | 'deleteOne'>]?: {
    selections?: SelectOptions;
    populations?: PopulateOptions[];
  };
};
export default function ResourceService<T>(
  schema: new () => T,
  options?: ResourceServiceOptions,
) {
  @Injectable()
  class ResourceService {
    constructor(
      @InjectModel(schema.name) public readonly resourceModel: Model<T>,
    ) {}
    create(model: T) {
      return this.resourceModel.create(model);
    }
    removeById(id: string) {
      return this.remove({ _id: id });
    }
    remove(filter: FilterQuery<T>) {
      return this.resourceModel.deleteOne(filter);
    }
    getModel() {
      return this.resourceModel;
    }
    updateById(
      id: string,
      object: T,
      populateOptions?: PopulateOptions | (PopulateOptions | string)[],
      selectOptions?: SelectOptions,
    ) {
      return this.updateOne(
        {
          _id: id,
        },
        object,
        populateOptions,
        selectOptions,
      );
    }
    updateOne(
      filter: FilterQuery<T>,
      object: Partial<T>,
      populateOptions?: PopulateOptions | (PopulateOptions | string)[],
      selectOptions?: SelectOptions,
    ) {
      return this.resourceModel
        .findOneAndUpdate(filter, object, { new: true })
        .select(selectOptions || options?.findOne?.selections)
        .populate(populateOptions || options?.findOne?.populations);
    }
    findById(
      id: string | any,
      populateOptions?: PopulateOptions | (PopulateOptions | string)[],
      selectOptions?: SelectOptions,
    ) {
      return this.findOne({ _id: id }, populateOptions, selectOptions);
    }
    async findOne(
      filter: FilterQuery<T>,
      populateOptions?: PopulateOptions | (PopulateOptions | string)[],
      selectOptions?: SelectOptions,
    ) {
      const query = this.resourceModel.findOne(filter);
      if (this.resourceModel.schema?.paths?.creator) {
        query.populate([{ path: 'creator', select: 'fullName mobile' }]);
      }
      return await query
        .findOne(filter)
        .select(selectOptions || options?.findOne?.selections)
        .populate(populateOptions || options?.findOne?.populations);
    }
    async findAll(
      searchQuery: PaginateQueryDTO<T>,
      populateOptions?: PopulateOptions | (PopulateOptions | string)[],
      selectOptions?: SelectOptions,
    ) {
      const query = this.resourceModel.find(searchQuery.filter);
      if (searchQuery.orderBy) {
        query.sort({
          [searchQuery.orderBy]: searchQuery.order || 'asc',
        });
      }

      if (this.resourceModel.schema?.paths?.creator) {
        query.populate([{ path: 'creator', select: 'fullName mobile' }]);
      }

      const result = await query
        .limit(Number(searchQuery.pageSize))
        .skip(Number(searchQuery.pageSize) * (Number(searchQuery.page) - 1))
        .select(selectOptions || options?.findAll?.selections)
        .populate(populateOptions || options?.findAll?.populations);

      const totalCount = await this.resourceModel.countDocuments(
        searchQuery.filter,
      );
      return { result, searchQuery, totalCount };
    }
  }
  return ResourceService;
}
