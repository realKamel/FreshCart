import { IProduct } from './iproduct';

export interface IProductsResult {
  results: number;
  metadata: Metadata;
  data: IProduct[];
}

interface Metadata {
  currentPage: number;
  numberOfPages: number;
  limit: number;
  nextPage: number;
}
