/**
 * Класс Entity - базовый для взаимодействия с сервером.
 * Имеет свойство URL, равно пустой строке.
 * */
class Entity {

  /**
   * Запрашивает с сервера список данных. 
   * Это могут быть счета или доходы/расходы
   * (в зависимости от того, что наследуется от Entity).
   * */
  static list(data, callback) {
    createRequest({
      data,
      callback,
      responseType: 'json',
      method: 'GET',
      url: this.URL
    });
  }

  /**
   * Создаёт счёт или доход/расход с помощью запроса
   * на сервер (в зависимости от того, что наследуется от Entity).
   * */
  static create(data, callback) {
    createRequest({
      data,
      callback,
      responseType: 'json',
      method: 'PUT',
      url: this.URL
    });
  }

  /**
   * Удаляет информацию о счёте или доходе/расходе
   * (в зависимости от того, что наследуется от Entity).
   * */
  static remove(data, callback) {
    createRequest({
      data,
      callback,
      responseType: 'json',
      method: 'DELETE',
      url: this.URL
    });
  }
}

Entity.URL = '';