// const { response } = require("express");

/**
 * Класс TransactionsPage управляет страницей отображения
 * доходов и расходов конкретного счёта.
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует, необходимо выкинуть
   * ошибку. Сохраняет переданный элемент и регистрирует события
   * через registerEvents().
   * */
  constructor(element) {
    if (!element) {
      throw new Error('Элемент не найден!');
    }

    this.element = element;
    this.registerEvents();
  }

  /**
   * Вызывает метод render для отрисовки страницы.
   * */
  update() {
    this.render(this.lastOptions);
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции и удаления
   * самого счёта. Внутри обработчика пользуйтесь методами
   * TransactionsPage.removeTransaction и TransactionsPage.removeAccount
   * соответственно.
   * */
  registerEvents() {
    this.element.addEventListener('click', (e) => {
      if (e.target.closest('.remove-account')) {
        this.removeAccount();
      } else if (e.target.closest('.transaction__remove')) {
        this.removeTransaction(e.target.closest('.transaction__remove').dataset.id);
      }
    });
  }

  /**
   * Удаляет счёт. Необходимо показать диалоговое окно (с помощью confirm()).
   * Если пользователь согласен удалить счёт, вызовите Account.remove, а также
   * TransactionsPage.clear с пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и
   * App.updateForms(), либо обновляйте только виджет со счетами и формы
   * создания дохода и расхода для обновления приложения.
   * */
  removeAccount() {
    if (!this.lastOptions) {
      return;
    } else {
      if (confirm('Вы действительно хотите удалить счёт?')) {
        Account.remove({ id: this.lastOptions.account_id }, (err, response) => {
          if (response) {
            App.update();
          }
        });
      }
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует подтверждения действия
   * (с помощью confirm()). По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами.
   * */
  removeTransaction(id) {
    if (confirm('Вы действительно хотите удалить эту транзакцию?')) {
      Transaction.remove({ id }, (err, response) => {
        if (response) {
          App.update();
        }
      });
    }
  }

  /**
   * С помощью Account.get() получает название счёта и отображает его через
   * TransactionsPage.renderTitle. Получает список Transaction.list и
   * полученные данные передаёт в TransactionsPage.renderTransactions().
   * */
  render(options) {
    if (!options) {
      return;
    }

    this.lastOptions = options;

    Account.get(options.account_id, (err, response) => {
      if (response.success) {
        this.renderTitle(response.data.name);
      }
    });

    Transaction.list({ account_id: options.account_id }, (err, response) => {
      this.renderTransactions(response.data);
    });
  }

  /**
   * Очищает страницу. Вызывает TransactionsPage.renderTransactions()
   * с пустым массивом. Устанавливает заголовок: «Название счёта».
   * */
  clear() {
    this.renderTransactions([]);
    this.renderTitle('Название счета');
    this.lastOptions = '';
  }

  /**
   * Устанавливает заголовок в элемент .content-title.
   * */
  renderTitle(name) {
    document.querySelector('.content-title').textContent = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20».
   * */
  formatDate(date) {
    let currentDate = new Date(date);//

    const day = currentDate.toLocaleString('ru', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const time = currentDate.toLocaleString('ru', {
      hour: 'numeric',
      minute: 'numeric',
    });

    return `${day} в ${time}`;
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода) в
   * item-объект с информацией о транзакции.
   * */
  getTransactionHTML(item) {

    const type = item.type;
    const name = item.name;
    const date = this.formatDate(item.created_at);
    const sum = item.sum;
    const id = item.id;

    return `<div class="transaction transaction_${type} row">
    <div class="col-md-7 transaction__details">
     <div class="transaction__icon">
      <span class="fa fa-money fa-2x"></span>
    </div>
    <div class="transaction__info">
     <h4 class="transaction__title">${name}</h4>
      <!-- дата -->
       <div class="transaction__date">${date}</div>
    </div>
   </div>
    <div class="col-md-3">
     <div class="transaction__summ">
      <!--  сумма -->
       ${sum} <span class="currency">₽</span>
     </div>
    </div>
   <div class="col-md-2 transaction__controls">
    <!-- в data-id нужно поместить id -->
     <button class="btn btn-danger transaction__remove" data-id=${id}>
      <i class="fa fa-trash"></i>  
     </button>
    </div>
   </div>
   `;
  }

  /**
   * Отрисовывает список транзакций на странице используя
   * getTransactionHTML.
   * */
  renderTransactions(data) {
    const content = this.element.querySelector('.content');//

    content.innerHTML = '';
    for (let element of data) {
      content.innerHTML += this.getTransactionHTML(element);
    }
  }
}