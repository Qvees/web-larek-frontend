
export interface IProductList{
    id: string,
    description: string,
    image: string,
    title: string,
    category: string,
    price: number;
    error?:string
}

export interface IOrderForm {
    email: string;
    phone: string;
    adress:string;
}

export interface IOrder extends IOrderForm {
    items: string[]
}

export interface IOrderResult {
    id: string;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IAppState {
    catalog: IProductList;
    basket: string[];
    preview: string | null;
    order: IOrder | null;
    loading: boolean;//???
}

export type IBasketItem = Pick<IProductList, 'id' | 'title' | 'price'>