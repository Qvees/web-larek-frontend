import { Component } from '../base/Component';
import { createElement } from '../../utils/utils';
import { EventEmitter } from '../base/events';
import { ProductItem } from '../AppData';

interface IBasketView {
	items: HTMLElement[];
	total: number;
	selected: string[];
	itemsInBasket: ProductItem[]; // Массив для хранения товаров в корзине
}

export class Basket extends Component<IBasketView> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLElement;
	protected _orderButton: HTMLElement;
	protected itemsInBasket: ProductItem[]; // Массив для хранения товаров в корзине
	protected _counter: HTMLElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);
		this.itemsInBasket = [];
		this._list = container.querySelector('.basket__list') as HTMLElement;
		this._total = container.querySelector('.basket__price') as HTMLElement;
		this._orderButton = container.querySelector('.basket__button');
		this._button = document.querySelector('.header__basket') as HTMLElement;
		this._counter = this._button.querySelector(
			'.header__basket-counter'
		) as HTMLElement;

		if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit('basket:open');
			});
		}

		if (this._orderButton) {
			this._orderButton.addEventListener('click', () => {
				events.emit('order:open');
			});
		}
	}

	set items(items: HTMLElement[]) {
		this._list.innerHTML = '';
		if (items.length) {
			this._list.append(...items);
		} else {
			this._list.innerHTML = '<p>Корзина пуста</p>';
		}
	}

	set selected(items: string[]) {
		this.setDisabled(this._button, items.length === 0);
	}

	set total(total: number) {
		this.setText(this._total, total.toString());
	}

	addItemToBasket(item: ProductItem) {
		this.itemsInBasket.push(item); // Добавляем товар в массив корзины
		this.renderBasketItems();
		localStorage.setItem('basketItems', JSON.stringify(this.itemsInBasket));
		this.updateCounter();
	}

	removeItemFromBasket(item: ProductItem) {
		this.itemsInBasket = this.itemsInBasket.filter((i) => i !== item);
		this.renderBasketItems();
		localStorage.setItem('basketItems', JSON.stringify(this.itemsInBasket));
		this.updateCounter();
	}

	renderBasketItems() {
		this._list.innerHTML = '';
		this.itemsInBasket.forEach((item) => {
			const newItem = createElement<HTMLLIElement>('li', {
				className: 'basket__item card card_compact',
			});
			newItem.innerHTML = `
                <span class="card__title">${item.title}</span>
                <span class="card__price">${item.price} синапсов</span>
                <button class="basket__item-delete card__button" aria-label="удалить"></button>
            `;
			newItem
				.querySelector('.basket__item-delete')
				?.addEventListener('click', () => {
					this.removeItemFromBasket(item);
				});
			this._list.appendChild(newItem);
		});
	}
	getItemsInBasket(): ProductItem[] {
		return this.itemsInBasket;
	}
	// Метод для обновления счетчика
	private updateCounter() {
		this._counter.textContent = this.itemsInBasket.length.toString();
	}
}
