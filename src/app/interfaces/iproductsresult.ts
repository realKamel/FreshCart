import { IProduct } from './iproduct';

export interface IProductsResult {
  results: number;
  metadata: {
    currentPage: number;
    numberOfPages: number;
    limit: number;
    nextPage: number;
  };
  data: IProduct[];
}
