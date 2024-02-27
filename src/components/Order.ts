import { Form } from './common/Form';
import { IOrderForm } from '../types/types';
import { EventEmitter, IEvents } from './base/events';
import { ensureElement } from '../utils/utils';
import { Modal } from '../components/common/Modal';
import { AppState } from './AppData';

export class Order extends Form<IOrderForm> {
	protected _payment: 'online' | 'offline' | null = null; // Свойство для хранения выбранного метода оплаты

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		// Обработчик для кнопки "Онлайн"
		const onlineButton = this.container.querySelector(
			'button[name="card"]'
		) as HTMLButtonElement;
		if (onlineButton) {
			onlineButton.addEventListener('click', () => {
				this.payment = 'online'; // Устанавливаем метод оплаты "Онлайн"
				this.updatePaymentButtons(); // Обновляем стили кнопок оплаты
			});
		}

		// Обработчик для кнопки "При получении"
		const cashButton = container.querySelector(
			'button[name="cash"]'
		) as HTMLButtonElement;
		if (cashButton) {
			cashButton.addEventListener('click', () => {
				this.payment = 'offline'; // Устанавливаем метод оплаты "При получении"
				this.updatePaymentButtons(); // Обновляем стили кнопок оплаты
			});
		}

		// Обработчик для кнопки "Далее"
		const nextButton = this.container.querySelector(
			'.order__button'
		) as HTMLButtonElement;
		if (nextButton) {
			nextButton.addEventListener('click', () => {
				this.handleNextButtonClick(); // Вызываем метод при нажатии кнопки "Далее"
			});
		}
	}

	// Метод для обновления стилей кнопок оплаты
	updatePaymentButtons() {
		const onlineButton = this.container.querySelector('button[name="card"]');
		const cashButton = this.container.querySelector('button[name="cash"]');

		onlineButton?.classList.remove('button_alt-active');
		cashButton?.classList.remove('button_alt-active');

		if (this._payment === 'online') {
			onlineButton?.classList.add('button_alt-active');
		} else if (this._payment === 'offline') {
			cashButton?.classList.add('button_alt-active');
		}
	}

	// Метод для обработки нажатия кнопки "Далее"
	handleNextButtonClick() {
		const addressInput = this.container.querySelector(
			'input[name="address"]'
		) as HTMLInputElement;
		const nextButton = this.container.querySelector(
			'.order__button'
		) as HTMLButtonElement;
		if (addressInput && this._payment) {
			// Отправляем событие о необходимости открыть форму контактов
			this.events.emit('contact:open');
		}
	}

	// Геттер для получения метода оплаты
	get payment(): 'online' | 'offline' | null {
		return this._payment;
	}

	// Сеттер для установки метода оплаты
	set payment(value: 'online' | 'offline' | null) {
		this._payment = value;
		// Генерируем событие о изменении метода оплаты
		this.events.emit('payment:changed', { field: 'payment', value });
	}

	// Геттер для получения значения адреса
	get address(): string {
		return (this.container.elements.namedItem('address') as HTMLInputElement)
			.value;
	}

	// Сеттер для установки значения адреса
	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}
}
