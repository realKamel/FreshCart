import { IBrand } from "./ibrand";
import { ICategory } from "./icategory";
import { ISubcategory } from "./isubcategory";

export interface IWishlistRes {
	status: string;
	count: number;
	data: IWishlist[];
}

export interface IWishlist {
	sold: number;
	images: string[];
	subcategory: ISubcategory[];
	ratingsQuantity: number;
	_id: string;
	title: string;
	slug: string;
	description: string;
	quantity: number;
	price: number;
	priceAfterDiscount?: number;
	imageCover: string;
	category: ICategory;
	brand: IBrand;
	ratingsAverage: number;
	createdAt: string;
	updatedAt: string;
	__v: number;
	id: string;
}
