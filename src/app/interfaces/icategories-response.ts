import { ICategory } from './icategory';

export interface ICategoriesResponse {
  results: number;
  metadata: {
    currentPage: number;
    numberOfPages: number;
    limit: number;
  };
  data: ICategory[];
}
