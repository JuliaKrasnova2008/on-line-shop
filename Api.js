class Api {
    constructor() {//по имени привязывается база данных
        this.url = "https://fakestoreapi.com/products" //тело запроса, которое никогда не меняется
    }
    //описываем метод Get
    getProduct() {
        return fetch(`${this.url}`) //fetch-запрос позволяет делать запрос на сервер(типо как в Постмен), по умолчанию работает как get-запрос
    }

    //метод, который получает информацию о товаре по id
    getSingleProduct(id) {
        return fetch(`${this.url}/${id}`)
    }

    //метод, который получает товары по выбору из section-количество
    getLimitResult(value) {
        return fetch(`${this.url}?limit=${value}`)
    }
}
