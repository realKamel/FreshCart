import { IBrand } from './ibrand';

export interface IBrandResponse {
  results: number;
  metadata: {
    currentPage: number;
    numberOfPages: number;
    limit: number;
    nextPage: number;
  };
  data: IBrand[];
}
