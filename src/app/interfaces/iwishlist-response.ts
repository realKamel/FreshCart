import { IProduct } from './iproduct';

export interface IWishlistResponse {
  status: string;
  count: number;
  data: IProduct[] | string[];
}
