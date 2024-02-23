import { Form } from "./common/Form";
import { IOrderForm } from "../types";
import { EventEmitter, IEvents } from "./base/events";
import { ensureElement } from "../utils/utils";
import { Modal } from '../components/common/Modal'

export class Contacts extends Form<IOrderForm> {
    protected _email: string = ''; // Приватное свойство для хранения email
    protected _phone: string = ''; // Приватное свойство для хранения телефона
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        // Добавляем обработчики событий для полей ввода телефона и электронной почты
        const phoneInput = this.container.querySelector('input[name="phone"]') as HTMLInputElement;
        const emailInput = this.container.querySelector('input[name="email"]') as HTMLInputElement;

         // Обработчик для поля ввода телефона
         phoneInput.addEventListener('input', () => {
            this._phone = phoneInput.value.trim(); // Обновляем значение телефона
            this.checkSubmitButtonState(); // Проверяем состояние кнопки "Оплатить"
        });

        // Обработчик для поля ввода электронной почты
        emailInput.addEventListener('input', () => {
            this._email = emailInput.value.trim(); // Обновляем значение электронной почты
            this.checkSubmitButtonState(); // Проверяем состояние кнопки "Оплатить"
        });
    

        // Обработчик для кнопки "Оплатить"
        const submitButton = this.container.querySelector('button[type="submit"]') as HTMLButtonElement;
        submitButton.addEventListener('click', () => {
            events.emit('payment:submit'); // Инициируем событие при нажатии на кнопку "Оплатить"
        });
    }

    // Метод для проверки состояния кнопки "Оплатить"
    checkSubmitButtonState() {
        const phoneInput = this.container.querySelector('input[name="phone"]') as HTMLInputElement;
        const emailInput = this.container.querySelector('input[name="email"]') as HTMLInputElement;
        const submitButton = this.container.querySelector('button[type="submit"]') as HTMLButtonElement;

        // Если оба поля заполнены, активируем кнопку "Оплатить", иначе деактивируем
        if (phoneInput.value.trim() !== '' && emailInput.value.trim() !== '') {
            submitButton.disabled = false;
        } else {
            submitButton.disabled = true;
        }
    }

    // Установка значения телефона
    set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    }

    // Установка значения email
    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }

    getEmail():string{
        return this._email

    }
    getPhone():string{
        return this._phone

    }
}
