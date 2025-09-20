export interface IQueryParameter {
  sort?: string;
  limit?: number;
  priceGte?: number;
  priceLte?: number;
  category?: string[] | string;
  keyword?: string;
  page?: number;
  brand?: string[] | string;
  fields?: string[];
}
