import { IProduct } from "./iproduct";

export interface ICart {
	_id: string
	cartOwner: string
	products: IProducts[]
	createdAt: string
	updatedAt: string
	__v: number
	totalCartPrice: number
  }

  export interface IProducts {
	count: number
	_id: string
	product: IProduct
	price: number
  }
