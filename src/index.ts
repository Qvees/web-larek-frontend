import './scss/styles.scss';

import { ShopAPI } from './components/ShopAPI';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { Page } from './components/Page';
import { cloneTemplate, createElement, ensureElement } from './utils/utils';
import { IOrderForm, IProductList } from './types';
import { Model } from './components/base/Model';
import _, { clone } from 'lodash';
import { Component } from './components/base/Component';
import {
	AppState,
	CatalogChangeEvent,
	ProductItem,
} from './components/AppData';
import { Card, CatalogItem, ICard } from './components/Card';
import { Success } from './components/common/Success';
import { Modal } from './components/common/Modal';
import { Basket } from './components/common/Basket';
import { Order } from './components/Order';


const events = new EventEmitter();
const api = new ShopAPI(CDN_URL, API_URL);
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Создание экземпляра BasketModal
// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const cardBasketModal = ensureElement<HTMLTemplateElement>('#card-basket');

//элементы
const modalAction = document.querySelector('.modal__actions');
const doOrderButton = modalAction.querySelector('.button');

// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);


// Связываем логику загрузки товаров в корзину событием load окна
window.addEventListener('load', () => {
	const storedItems = localStorage.getItem('basketItems');
	if (storedItems) {
		const parsedItems = JSON.parse(storedItems);
		// Обновляем состояние корзины
		parsedItems.forEach((item: ProductItem) => basket.addItemToBasket(item));
	}
});

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
});

//отрисовка карточек на странице
events.on<CatalogChangeEvent>('items:changed', () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new CatalogItem(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			title: item.title,
			image: item.image,
			description: item.description,
			price: item.price,
			category: item.category,
		});
	});
	page.counter = basket.getItemsInBasket().length;
});

// Изменилось состояние валидации формы
events.on('formErrors:change', (errors: Partial<IOrderForm>) => {
	const { email, phone, adress } = errors;
	order.valid = !email && !phone && !adress;
	order.errors = Object.values({ phone, email, adress })
		.filter((i) => !!i)
		.join('; ');
});

// Изменилось одно из полей
events.on(
	/^order\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

// Открыть  продукт
events.on('card:select', (item: ProductItem) => {
	appData.setPreview(item);
	const card = new CatalogItem(cloneTemplate(cardPreviewTemplate));
	modal.render({
		content: card.render({
			title: item.title,
			description: item.description,
			image: item.image,
			price: item.price,
			button: item.button,
			category: item.category,
		}),
	});

	// кнопка добавления товара в корзину (скорее всего не так сделал надо переделать)!!!!!!
	const modalContainer = document.querySelector('#modal-container');
	const addToBasketButton = modalContainer.querySelector('.card .card__button');
	addToBasketButton.addEventListener('click', () => {
		// Добавляем товар в корзину
		basket.addItemToBasket(item);
		localStorage.setItem(
			'basketItems',
			JSON.stringify(basket.getItemsInBasket())
		);
		modal.close();
		page.counter = basket.getItemsInBasket().length;
	});
});

//открытие корзины
events.on('basket:open', () => {
	modal.render({
		content: basket.render(),
	});
});

//оформить заказа
events.on('order:open', () => {
	modal.render({
		content: order.render({
			adress: '',
			valid: false,
			errors: [],
		}),
	});
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
	page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
	page.locked = false;
});

// Получаем товары с сервера
api
	.getProductList()
	.then(appData.setCatalog.bind(appData))
	.catch((err) => {
		console.error(err);
	});
