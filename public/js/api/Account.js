/**
 * Класс Account наследуется от Entity.
 * Управляет счетами пользователя.
 * Имеет свойство URL со значением '/account'.
 * */
class Account extends Entity {

  /**
   * Получает информацию о счёте.
   * */
  static get(id = '', callback) {
    createRequest({
      callback,
      method: 'GET',
      responseType: 'json',
      url: this.URL + '/' + id,
    });
  }
}

Account.URL = '/account';