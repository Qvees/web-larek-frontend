import { Form } from "./common/Form";
import { IOrderForm } from "../types/types";
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
         // Проверяем, что введенный номер телефона соответствует формату телефонного номера
        const phonePattern = /^\+?\d{1,3}?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{2}[\s.-]?\d{2}$/;
        const isPhoneValid = phonePattern.test(phoneInput.value.trim());

    // Проверяем, что введенный email соответствует формату адреса электронной почты
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isEmailValid = emailPattern.test(emailInput.value.trim());
        const formErrors = this.container.querySelector('.form__errors')

        // Если оба поля заполнены, активируем кнопку
        if (isPhoneValid && isEmailValid) {
            formErrors.textContent = ''
            submitButton.disabled = false;
        } else {
            formErrors.textContent = 'Введите почту и номер телефона'
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
