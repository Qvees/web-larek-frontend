import { Api, ApiListResponse } from './base/api';
import {IOrder, IOrderResult,IProductList} from "../types/index";
import { Contacts } from './Contacts';

export interface IShopAPI {
    getProductList: () => Promise<IProductList[]>; // получаем не полное описание 
    getProductItem: (id: string) => Promise<IProductList>;// получаем объекты с полным описание 
    orderProduct: (order: IOrder) => Promise<IOrderResult>;
}

export class ShopAPI extends Api implements IShopAPI {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    getProductItem(id: string): Promise<IProductList> {
        return this.get(`/product/${id}`).then(
            (item: IProductList) => ({
                ...item,
                image: this.cdn + item.image,
            })
        );
    }


    getProductList(): Promise<IProductList[]> {
        return this.get('/product').then((data: ApiListResponse<IProductList>) =>
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image
            }))
        );
    }

    orderProduct(order: IOrder): Promise<IOrderResult> {
        return this.post('/order', order).then(
            (data: IOrderResult) => data
        );
    }

}