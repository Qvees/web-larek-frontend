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
	protected _orderButton: HTMLButtonElement;
	protected itemsInBasket: ProductItem[]; // Массив для хранения товаров в корзине
	protected _counter: HTMLElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);
		this.itemsInBasket = [];
		this._list = container.querySelector('.basket__list') as HTMLElement;
		this._total = container.querySelector('.basket__price') as HTMLElement;
		this._orderButton = container.querySelector(
			'.basket__button'
		) as HTMLButtonElement;
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

	set total(total: number) {
		this.setText(this._total, total.toString());
	}

	addItemToBasket(item: ProductItem) {
		this.itemsInBasket.push(item); // Добавляем товар в массив корзины
		this.renderBasketItems();
		this.updateTotal();
		localStorage.setItem('basketItems', JSON.stringify(this.itemsInBasket));
		this.updateCounter();
	}

	removeItemFromBasket(item: ProductItem) {
		this.itemsInBasket = this.itemsInBasket.filter((i) => i !== item);
		this.renderBasketItems();
		this.updateTotal();
		localStorage.setItem('basketItems', JSON.stringify(this.itemsInBasket));
		this.updateCounter();
	}
	updateTotal() {
		let total = 0;

		// Проходим по всем товарам в корзине и суммируем их цены
		this.itemsInBasket.forEach((item) => {
			total += item.price;
		});
		this.getItemsInBasket();
		// Устанавливаем общую цену в элемент интерфейса
		return (this.total = total);
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
		if (this.itemsInBasket.length === 0) {
			this._list.innerHTML = '<p>Корзина пуста</p>';
			this.setDisabled(this._orderButton, true);
		} else {
			this.setDisabled(this._orderButton, false);
		}

		return this.itemsInBasket;
	}

	getItemId() {
		return this.itemsInBasket.map((item) => item.id);
	}

	clearBasket() {
		// Очистка массива товаров в корзине
		this.itemsInBasket = [];
		// Обновление отображения корзины
		this.renderBasketItems();
		// Обновление общей суммы
		this.updateTotal();
		// Очистка localstorage
		localStorage.removeItem('basketItems');
		// Обновление счетчика
		this.updateCounter();
	}

	// Метод для обновления счетчика
	private updateCounter() {
		this._counter.textContent = this.itemsInBasket.length.toString();
	}
}
