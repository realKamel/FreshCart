import { IProduct } from './iproduct';

export interface ICartItem {
  count: number;
  _id: string;
  product: IProduct | string;
  price: number;
}
