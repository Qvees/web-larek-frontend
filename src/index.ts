import './scss/styles.scss';

import {ShopAPI} from "./components/ShopAPI";
import {API_URL, CDN_URL} from "./utils/constants";
import {EventEmitter} from "./components/base/events";
import {Page} from "./components/Page";
//import {Auction, AuctionItem, BidItem, CatalogItem} from "./components/Card";
import {cloneTemplate, createElement, ensureElement} from "./utils/utils";
import {IOrderForm, IProductList} from "./types";
import { Model } from './components/base/Model';
import _ from 'lodash';
import { Component } from './components/base/Component';
import {AppState, CatalogChangeEvent, ProductItem} from "./components/AppData";
import { Card, CatalogItem } from './components/Card';

const events = new EventEmitter();
const api = new ShopAPI(CDN_URL, API_URL);
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
//const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
//const order = new Order(cloneTemplate(orderTemplate), events);

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})


events.on<CatalogChangeEvent>('items:changed', () => {
    page.catalog = appData.catalog.map(item => {
        const card = new CatalogItem(cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', item)
        });
        return card.render({
            title: item.title,
            image: item.image,
            description: item.description,
            price: item.price,
            category: item.category,
        });
    });

    page.counter = appData.getProducts().length;
    console.log(appData)
});

// Получаем лоты с сервера
api.getProductList()
    .then(appData.setCatalog.bind(appData))
    .catch(err => {
        console.error(err);
    });


