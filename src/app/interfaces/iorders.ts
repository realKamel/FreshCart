import { IProduct } from "./iproduct";
import { IUser } from "./iuser";

export interface IOrders {
	shippingAddress: ShippingAddress;
	taxPrice: number;
	shippingPrice: number;
	totalOrderPrice: number;
	paymentMethodType: string;
	isPaid: boolean;
	isDelivered: boolean;
	_id: string;
	user: IUser;
	cartItems: CartItem[];
	paidAt: string;
	createdAt: string;
	updatedAt: string;
	id: number;
	__v: number;
}

export interface ShippingAddress {
	details: string;
	phone: string;
	city: string;
}

export interface CartItem {
	count: number;
	_id: string;
	product: IProduct;
	price: number;
}
