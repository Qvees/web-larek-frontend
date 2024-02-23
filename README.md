# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss— корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

Как я понял у меня нет явного презентера.

## Архитектура проекта с использованием паттерна MVP (Model-View-Presenter):

### Model (Модель):

- Класс Model
- Класс AppState
- Класс ShopAPI
- Класс Order

### View (Представление):
- Класс Component
- Класс Page
- Класс Modal
- Класс Basket
- Класс Card
- Класс Contacts
- Класс Success

### В файле index.ts в папке types определены различные интерфейсы и типы данных, которые используются в приложении:

#### IProduct:
interface IProduct{ 
    id: string, 
    description: string, 
    image: string, 
    title: string, 
    category: string, 
    price: number,
    error?:string 
}  
```

#### IOrderForm:
- Описывает интерфейс формы заказа.
- Содержит свойства:
    - email: Email для заказа (строка).
    - phone: Номер телефона для заказа (строка).
    - address: Адрес доставки (строка).
    - payment: Метод оплаты (тип PaymentMethod).

#### IOrder:
- Расширяет интерфейс IOrderForm.
- Добавляет свойства:
    - items: Массив строк, содержащий идентификаторы заказанных товаров.
    - total: Общая сумма заказа (число).

#### IOrderResult:
- Описывает интерфейс результата заказа.
- Содержит свойства:
    - id: Уникальный идентификатор заказа (строка).
    - total: Общая сумма заказа (число).

#### FormErrors:
- Тип, представляющий частичный набор ошибок формы.
- Используется для валидации формы заказа.

#### IAppState:
- Описывает состояние приложения.
- Содержит свойства:
    - catalog: Каталог продуктов.
    - basket: Массив строк, содержащий идентификаторы товаров в корзине.
    - preview: Идентификатор предпросмотра продукта.
    - order: Информация о текущем заказе.
    
#### IBasketItem:
- Описывает элемент корзины.
- Содержит свойства:
    - id: Уникальный идентификатор продукта.
    - title: Название продукта.
    - price: Цена продукта.

Эти типы используются для описания данных и состояния приложения, таких как продукты, заказы, корзина и формы.

____________________________________________________________________________________________________________________

### Слой Model (Модель):

#### Класс Model<T>:
- Model - абстрактный класс, который служит базовым для всех моделей.
- Конструктор принимает два аргумента:
    - data: объект типа T, который инициализирует свойства модели.
    - events: экземпляр IEvents, используемый для управления событиями.
- В конструкторе свойства модели инициализируются значениями из data с помощью Object.assign.
- Метод emitChanges используется для оповещения об изменениях в модели. Он принимает имя события event и необязательный параметр payload, который содержит дополнительные данные для передачи в событие.
- emitChanges вызывает метод emit экземпляра IEvents, чтобы оповестить об изменениях в модели.

#### Функция isModel:
- isModel - это функция, которая принимает объект в качестве аргумента и возвращает булево значение, указывающее, является ли этот объект экземпляром класса Model.
- Возвращает true, если объект является экземпляром Model, и false в противном случае.

#### Класс ProductItem:
- Наследует от Model<IProduct>:
- Model является базовым классом, который предоставляет основные методы для работы с моделью данных. ProductItem использует этот функционал для управления информацией о продукте.
- Свойства:
    - description, id, image, title, price, category: Хранят информацию о продукте, включая его описание, идентификатор, изображение, название, цену и категорию.
    - button: Опциональное свойство, представляющее собой ссылку на HTML-элемент кнопки.
__________________________________________________

### Класс AppState

Наследует от Model<IAppState>:
AppState также является моделью данных, предназначенной для хранения состояния приложения.

#### Свойства:
- **basket**: Массив строк, представляющий товары в корзине.
- **catalog**: Массив ProductItem, содержащий информацию о продуктах.
- **loading**: Логическое значение, указывающее на процесс загрузки данных.
- **order**: Объект, содержащий информацию о заказе, включая адрес, электронную почту, телефон, список товаров, общую сумму и способ оплаты.
- **preview**: Идентификатор предпросматриваемого продукта.
- **formErrors**: Объект, содержащий ошибки формы.

#### Методы:
- `toggleOrderedProduct(id: string, isIncluded: boolean)`: Добавляет или удаляет товар из заказа.
- `clearBasket()`: Очищает корзину.
- `getTotal()`: Вычисляет общую сумму заказа.
- `setCatalog(items: IProduct[])`: Устанавливает каталог продуктов.
- `setPreview(item: ProductItem)`: Устанавливает предпросматриваемый продукт.
- `setOrderField(field: keyof IOrderForm, value: 'online'|'offline')`: Устанавливает значения полей заказа.
- `getProducts()`: Возвращает продукты из каталога.
- `validateOrder()`: Проверяет правильность заполнения формы заказа.

---

### Класс Order

Наследует от Form<IOrderForm>:
Form является базовым классом для форм, который предоставляет функционал для работы с формами. Order использует этот функционал для управления данными формы заказа.

#### Свойства:
- **paymentMethod**: Свойство для хранения выбранного метода оплаты. Принимает значения 'online', 'offline'

#### Конструктор:
Принимает контейнер формы и объект событий events.
Инициализирует обработчики событий для кнопок "Далее", "Онлайн" и "При получении".

#### Методы:
- `updatePaymentButtons()`: Обновляет стили кнопок оплаты в зависимости от выбранного метода оплаты.
- `handleNextButtonClick()`: Обрабатывает нажатие кнопки "Далее". Проверяет, указан ли адрес и выбран ли способ оплаты, и отправляет событие о необходимости открытия формы контактов.
- `getPaymentMethod()`: Возвращает текущий выбранный метод оплаты.
- `set phone(value: string), set email(value: string), set address(value: string)`: Устанавливает значения телефона, email и адреса в соответствующие поля формы.

---

### Класс ShopAPI

Предоставляет методы для взаимодействия с API магазина. 

#### Интерфейс IShopAPI:
Описывает методы, которые должны быть реализованы в классе ShopAPI.
- `getProductList`: Получение списка продуктов.
- `getProductItem`: Получение информации о конкретном продукте.
- `orderProduct`: Оформление заказа.

#### Класс ShopAPI:
- Расширяет класс Api для работы с API.
- Содержит свойство cdn, представляющее URL-адрес контентного хранилища.
- В конструкторе принимает cdn, базовый URL и дополнительные параметры запроса.
- Метод `getProductItem(id: string)`: Отправляет запрос на получение информации о продукте с указанным идентификатором. Обрабатывает полученные данные, добавляя URL-адрес CDN к изображению продукта.
- Метод `getProductList()`: Отправляет запрос на получение списка продуктов. Также обрабатывает полученные данные, добавляя URL-адрес CDN к изображениям продуктов.
- Метод `orderProduct(order: IOrder)`: Отправляет запрос на оформление заказа с переданными данными. Возвращает результат заказа.
_________________________________________________________________________________________________________________________________________________

### View (Представление):

#### Класс Component

Класс Component представляет собой базовый компонент, который используется для создания других компонентов в приложении. 

**Конструктор:**
Принимает один аргумент - container, который представляет собой DOM-элемент, в который будет встраиваться компонент.
Код в конструкторе выполняется до всех объявлений в дочернем классе.

**Методы:**
- `toggleClass`: Переключает класс у указанного элемента.
- `setText`: Устанавливает текстовое содержимое указанного элемента.
- `setDisabled`: Устанавливает состояние блокировки указанного элемента.
- `setHidden`: Скрывает указанный элемент, устанавливая ему свойство display: none.
- `setVisible`: Показывает указанный элемент, удаляя свойство display: none.
- `setImage`: Устанавливает изображение для указанного элемента <img> с альтернативным текстом.
- `element`: Геттер, возвращающий корневой DOM-элемент компонента.
- `render`: Метод для рендеринга компонента, принимает объект data с данными для обновления компонента. Обновляет компонент, применяя данные из data.

*Абстрактный:*
Класс Component является абстрактным, что означает, что он не может быть создан напрямую, а только наследован.

---

#### Класс Page

Класс Page расширяет базовый класс Component<IPage>.

**Интерфейс IPage:**
Описывает структуру данных, ожидаемых для отображения на странице. Содержит счетчик, каталог элементов и флаг блокировки.

**Конструктор:**
Принимает контейнер страницы (HTMLElement) и объект событий (IEvents).
Инициализирует основные элементы страницы, такие как счетчик корзины, каталог товаров и обертка страницы.
При клике на корзину (_basket) генерирует событие "bids:open".

**Методы:**
- `setCounter`, `setCatalog`, `setLocked`: Устанавливают значения счетчика, каталога и флага блокировки страницы соответственно. Обновляют содержимое страницы в соответствии с переданными данными.

---

#### Класс Modal

Modal представляет модальное окно.

**Конструктор:**
Принимает два аргумента: container - HTML-элемент, представляющий контейнер модального окна, и events - экземпляр IEvents, используемый для обработки событий.
Инициализирует свойства _closeButton (кнопка закрытия модального окна) и _content (контейнер для содержимого модального окна).
Устанавливает обработчики событий на кнопку закрытия и клики вне контента модального окна для закрытия его.

**Методы:**
- `open`: Открывает модальное окно и генерирует событие modal:open.
- `close`: Закрывает модальное окно, удаляет его содержимое и генерирует событие modal:close.
- `render`: Вызывается для отображения модального окна с данными из объекта data.

---

#### Класс Form<T>

Form<T> - это класс, представляющий форму.

**Конструктор:**
Принимает два аргумента: container - HTML-элемент формы, и events - экземпляр IEvents, используемый для обработки событий.
Инициализирует свойства _submit (кнопка отправки формы) и _errors (элемент для отображения ошибок формы).
Устанавливает слушатели событий на изменения в полях формы и предотвращение стандартной отправки формы.

**Методы:**
- `onInputChange`: Вызывается при изменении значений в полях формы и генерирует соответствующее событие.
- `render`: Отображает состояние формы, принимая объект state, который содержит данные о валидности формы и ошибках.
- В методе render происходит вызов super.render, который вызывает метод родительского класса Component, и затем свойства класса Form обновляются значениями из inputs.

____________________________________________________________________________________________________________________

### Класс Basket:

Расширение от базового класса Component<IBasketView>:

Basket расширяет базовый класс Component<IBasketView>, что означает, что он является компонентом веб-приложения, который отображает содержимое корзины.

#### Интерфейс IBasketView:

IBasketView определяет интерфейс данных, которые использует компонент корзины. Включает в себя элементы, такие как items, total, selected, itemsInBasket.

#### Свойства класса Basket:

- _list, _total, _button, _orderButton, _counter: Это элементы DOM, представляющие различные части компонента корзины.
- itemsInBasket: Массив для хранения товаров в корзине.

#### Конструктор:

Принимает контейнер (элемент DOM) и экземпляр EventEmitter, который предоставляет механизм для обработки событий.
Инициализирует свойства компонента, находит необходимые элементы DOM и устанавливает обработчики событий.

#### Методы для работы с корзиной:

- set total(total: number): Устанавливает общую стоимость заказа.
- addItemToBasket(item: ProductItem): Добавляет товар в корзину.
- removeItemFromBasket(item: ProductItem): Удаляет товар из корзины.
- updateTotal(): Обновляет общую стоимость корзины.
- renderBasketItems(): Отображает товары в корзине.
- getItemsInBasket(): Возвращает товары, находящиеся в корзине.
- getItemId(): Возвращает идентификаторы товаров в корзине.
- clearBasket(): Очищает корзину.

#### Приватный метод updateCounter():

Обновляет счетчик товаров в корзине.

### Класс Card<T>:

Представляет карточку товара в приложении.

#### Интерфейсы и типы данных:

- ICardActions: Определяет действия, которые могут быть выполнены при взаимодействии с карточкой товара.
- ICard<T>: Описывает структуру данных карточки товара, включая заголовок, описание, изображение, категорию, цену и кнопку.

#### Класс Card<T>:

- constructor: Принимает блок-имя (название класса блока), контейнер (DOM-элемент, содержащий карточку) и действия.
- В конструкторе инициализируются элементы DOM карточки, такие как заголовок, изображение, описание, категория, цена и кнопка.
- Методы setTitle, setCategory, setPrice, setImage, setDescription устанавливают соответствующие значения элементам DOM карточки.
- Методы getTitle, getCategory, getPrice возвращают значения соответствующих элементов DOM карточки.
- Методы id возвращают и устанавливают идентификатор карточки.

#### Класс CatalogItem:

Расширяет класс Card<IProductList> и представляет карточку товара из каталога.
- Конструктор принимает контейнер (DOM-элемент, содержащий карточку) и действия.

### Класс Contacts:

Компонент для ввода контактной информации пользователя, такой как email и телефон.
- Наследует от Form<IOrderForm>:

#### Свойства:

- _email: Приватное свойство для хранения email.
- _phone: Приватное свойство для хранения телефона.

#### Конструктор:

Принимает контейнер формы и объект событий events.
- Инициализирует обработчики событий для полей ввода телефона и электронной почты.
- Инициализирует обработчик для кнопки "Оплатить".

#### Методы:

- checkSubmitButtonState(): Проверяет состояние кнопки "Оплатить" в зависимости от заполненности полей ввода телефона и email.
- set phone(value: string), set email(value: string): Устанавливает значения телефона и email в соответствующие поля формы.
- getEmail(): string, getPhone(): string: Возвращает значение email и телефона соответственно.

### Класс Success:

Success наследует функциональность от класса Component<ISuccess>, который предоставляет базовый функционал для создания компонентов.

#### Свойства:

- _close: HTML-элемент, представляющий кнопку закрытия компонента успеха.
- _total: Свойство для хранения общего количества синапсов.

#### Конструктор:

Принимает контейнер для отображения компонента, объект событий actions, и общее количество синапсов total.
- Инициализирует обработчик для кнопки закрытия компонента, если передана функция onClick в объекте actions.

#### Методы:
- setTotal(total: number): Устанавливает общее количество синапсов и обновляет соответствующий элемент в компоненте для отображения этой информации.

