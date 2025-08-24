export interface queryParameter {
  sort?: string;
  limit?: number;
  priceGte?: number;
  priceLte?: number;
  category?: string;
  keyword?: string;
  page?: number;
  brand?: string;
  fields?: string[];
}
