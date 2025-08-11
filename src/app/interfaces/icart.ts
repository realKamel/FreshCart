import { IProduct } from './iproduct';

export interface ICart {
  _id: string;
  cartOwner: string;
  products: ICartItems[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  totalCartPrice: number;
}

export interface ICartItems {
  count: number;
  _id: string;
  product: IProduct;
  price: number;
}
