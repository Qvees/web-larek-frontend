import { Form } from "./common/Form";
import { IOrderForm } from "../types";
import { EventEmitter, IEvents } from "./base/events";
import { ensureElement } from "../utils/utils";
import {Modal} from '../components/common/Modal'
import { AppState } from "./AppData";

export class Order extends Form<IOrderForm> {
    private paymentMethod: 'card' | 'cash' | null = null; // Свойство для хранения выбранного метода оплаты

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

           // Обработчик для кнопки "Далее"
    const nextButton = this.container.querySelector('.order__button') as HTMLButtonElement;
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            this.handleNextButtonClick(); // Вызываем метод при нажатии кнопки "Далее"
        });
    }


        // Обработчик для кнопки "Онлайн"
        const onlineButton = this.container.querySelector('button[name="card"]') as HTMLButtonElement;
        if (onlineButton) {
            onlineButton.addEventListener('click', () => {
                this.paymentMethod = 'card'; // Устанавливаем метод оплаты "Онлайн"
                this.updatePaymentButtons(); // Обновляем стили кнопок оплаты
            });
        }

        // Обработчик для кнопки "При получении"
        const cashButton = container.querySelector('button[name="cash"]') as HTMLButtonElement;
        if (cashButton) {
            cashButton.addEventListener('click', () => {
                this.paymentMethod = 'cash'; // Устанавливаем метод оплаты "При получении"
                this.updatePaymentButtons(); // Обновляем стили кнопок оплаты
            });
        }
    }

    // Метод для обновления стилей кнопок оплаты
    updatePaymentButtons() {
        const onlineButton = this.container.querySelector('button[name="card"]');
        const cashButton = this.container.querySelector('button[name="cash"]');
    
        onlineButton?.classList.remove('button_alt-active'); 
        cashButton?.classList.remove('button_alt-active'); 
    
        if (this.paymentMethod === 'card') {
            onlineButton?.classList.add('button_alt-active'); 
            
        } else if (this.paymentMethod === 'cash') {
            cashButton?.classList.add('button_alt-active'); 
        }
    }

     // Метод для обработки нажатия кнопки "Далее"
     handleNextButtonClick() {
        const addressInput = this.container.querySelector('input[name="address"]') as HTMLInputElement;
        if (addressInput && this.paymentMethod) {
            
            // Отправляем событие о необходимости открыть форму контактов
            this.events.emit('contact:open');
        } else {
            console.error('Не указан адрес или способ оплаты');
        }
        console.log(this.container)
    }

    getPaymentMethod(){
        return this.paymentMethod

    }
    // Установка значения телефона
    set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    }

    // Установка значения email
    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }

    // Установка значения адреса
    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }
}
