import _ from "lodash";

import {Model} from "./base/Model";
import {FormErrors, IAppState, IBasketItem, IProductList, IOrder, IOrderForm} from "../types";
import { Contacts } from './Contacts';

export type CatalogChangeEvent = {
    catalog: ProductItem[]
};

export class ProductItem extends Model<IProductList> {
    description: string;
    id: string;
    image: string;
    title: string;
    price: number;
    category:string;
    button?:HTMLButtonElement;

}

export class AppState extends Model<IAppState> {
    basket: string[];
    catalog: ProductItem[];
    loading: boolean;
    order: IOrder = {
        email: '',
        phone: '',
        address:'',
        items: [],
        paymentMethod:''
    };
    preview: string | null;
    formErrors: FormErrors = {};

    toggleOrderedProduct(id: string, isIncluded: boolean) {
        if (isIncluded) {
            this.order.items = _.uniq([...this.order.items, id]);
        } else {
            this.order.items = _.without(this.order.items, id);
        }
    }

    clearBasket() {
        this.order.items.forEach(id => {
            this.toggleOrderedProduct(id, false);
        });
    }

    getTotal() {
        return this.order.items.reduce((a, c) => a + this.catalog.find(it => it.id === c).price, 0)
    }

    setCatalog(items: IProductList[]) {
        this.catalog = items.map(item => new ProductItem(item, this.events));
        this.emitChanges('items:changed', { catalog: this.catalog });
    }

    setPreview(item: ProductItem) {
        this.preview = item.id;
        this.emitChanges('preview:changed', item);
    }

    setOrderField(field: keyof IOrderForm, value: string) {
        this.order[field] = value;

        if (this.validateOrder()) {
            this.events.emit('order:ready', this.order);
        }
    }

    getProducts(): ProductItem[] {
        return this.catalog
           
    }

    validateOrder() {
        const errors: typeof this.formErrors = {};
        if (!this.order.address){
            errors.address = 'Необходимо указать адресс'
        }
        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }
}
