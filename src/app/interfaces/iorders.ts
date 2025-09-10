import { ICartItem } from './icart-item';
import { IOrderAddress } from './IOrderAddress';
import { IUser } from './iuser';

export interface IOrders {
  shippingAddress: IOrderAddress;
  taxPrice: number;
  shippingPrice: number;
  totalOrderPrice: number;
  paymentMethodType: string;
  isPaid: boolean;
  isDelivered: boolean;
  _id: string;
  user: IUser;
  cartItems: ICartItem[];
  paidAt: string;
  createdAt: string;
  updatedAt: string;
  id: number;
  __v: number;
}
