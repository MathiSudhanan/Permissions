export interface IMetaData {
  currentPage: number;
  totalPage: number;
  pageSize: number;
  totalCount: number;
}

export class PaginatedResponse<T> {
  /**
   *
   */
  constructor(items: T, metaData: IMetaData) {
    this.items = items;
    this.metaData = metaData;
  }
  items: T;
  metaData: IMetaData;
}
