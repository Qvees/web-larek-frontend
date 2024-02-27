export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number;
	error?: string;
}

type PaymentMethod = 'online' | 'offline';

export interface IOrderForm {
	email: string;
	phone: string;
	address: string;
	payment: PaymentMethod;
}

export interface IOrder extends IOrderForm {
	items: string[];
	total: number;
}

export interface IOrderResult {
	id: string;
	total: number;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IAppState {
	catalog: IProduct;
	basket: string[];
	preview: string | null;
	order: IOrder | null;
}

export type IBasketItem = Pick<IProduct, 'id' | 'title' | 'price'>;
