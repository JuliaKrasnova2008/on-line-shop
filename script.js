const api = new Api()
const $wrapper = document.querySelector("[data-wrapper]")//достаем контейнер для элемента
const $spinner = document.querySelector("[data-spinner]")

const $modalShow = document.querySelector("[data-modal]")//достаем по дата-атрибуту контейнер для модального окна
const $imgShow = document.querySelector("#image")
const $descriptionShow = document.querySelector("#description")
const $priceShow = document.querySelector("#price")
const $ratingShow = document.querySelector("#rating")
const $nameShow = document.querySelector("#title")

const $modalCloseBtn = document.querySelectorAll(".modal__close")

const $select = document.querySelector("[data-select]")
const $selectSort = document.querySelector("[data-select-sort]")

const $darkTypeBtn = document.querySelector("[data-dark-btn]")
const $whiteTypeBtn = document.querySelector("[data-white-btn]")
const $mainPage = document.querySelector(".page")

//перейти в ночной режим
$darkTypeBtn.addEventListener("click", () => {
  $mainPage.classList.add("dark-theme")
  $darkTypeBtn.classList.add("hidden")
  $whiteTypeBtn.classList.remove("hidden")
})
//перейти в дневной режим
$whiteTypeBtn.addEventListener("click", () => {
  $mainPage.classList.remove("dark-theme")
  $whiteTypeBtn.classList.add("hidden")
  $darkTypeBtn.classList.remove("hidden")
})

//закрытие модалки по клику на крестик
$modalCloseBtn.forEach((elem) => {
  elem.addEventListener("click", () => { //на каждый элемент вешаем событие по клику
    closeModal() //закрыть модалку
  })
})

//закрытие по клику ВНЕ окна
$modalShow.addEventListener("click", (evt) => {
  if (evt.target === $modalShow) {
    closeModal()
  }
})

//закрытие модалки по клику на Esc
document.addEventListener("keydown", (evt) => {
  if (evt.code === "Escape" && !$modalShow.classList.contains("hidden")) { //classList.contains("class") – проверка наличия класса
    closeModal()
  }
})

//функция закрытие модалки
function closeModal() {
  $modalShow.classList.add("hidden") //вешаем на них класс hidden
};

//функция, которая генерит карточки с товарами
async function generateCard() {//async-ассинхронная, внутри нее будет происходить ассинхронные действия
  $whiteTypeBtn.classList.add("hidden")
  $spinner.classList.remove("hidden")//удаляем класс, спинер показывается

  const response = await api.getProduct() //await-ждем ответ от сервера и заносим в переменную("подожди пока апи получит всех котов, а потом занести в конс респонс")
  const data = await response.json() //переводим формат json, в привычный js

  //все, что внутри setTimeout выполнится с задержкой 500милисек.
  setTimeout(() => {
    data.forEach(element => {
      $spinner.classList.add("hidden")//удаляем класс, спинер показывается
      //insertAdjacentHTML("beforeend") - добавляет элемент в разметку по указанной позиции
      $wrapper.insertAdjacentHTML("beforeend", generateProductHtml(element))//добавляются по функции html-эл с разметкой
    });
  }, 500)

}
generateCard()

//функция, которая генерит html-элементы
function generateProductHtml(elem) {
  return `<li class="products__item" data-id=${elem.id} >
    <img
      data-action="show"
      class="products__foto"
      src="${elem.image}"
      alt="${elem.title}"
    />
    <h2 class="products__title">${elem.title}</h2>
    <p class="products__subtitle">${elem.price.toLocaleString()} $</p>
    <button class="products__button" type="button">
      Добавить в корзину
    </button>
  </li>`
}

$wrapper.addEventListener("click", (evt) => {
  switch (evt.target.dataset.action) {
    case "show":
      const currentCardId = evt.target.closest('[data-id]')
      const cardId = currentCardId.dataset.id;

      $spinner.classList.remove("hidden")//удаляем класс, спинер показывается

      api.getSingleProduct(cardId).then((res) => {
        return res.json()
      })
        .then((data) => {

          $imgShow.src = data.image
          $descriptionShow.innerHTML = data.description
          $priceShow.innerHTML = data.price.toLocaleString() + " $"
          $ratingShow.innerHTML = data.rating.rate
          $nameShow.innerHTML = data.title

          setTimeout(() => {
            $spinner.classList.add("hidden")//удаляем класс, спинер показывается
            $modalShow.classList.remove("hidden")//у модалки убираем класс хиден, те показываем
          }, 100)
        })

      break;

    default:
      break;
  }

})

//условия выбора section - количество товара на странице
$select.addEventListener("change", () => {//метод change - следит за любыми изменениями элемента
  const selectIndex = $select.selectedIndex //selectedIndex- получаем индекс выбранного option
  switch (selectIndex) {
    case 0:
      generateLimitProd(10)
      break;
    case 1:
      generateLimitProd(15)
      break;
    case 2:
      generateLimitProd(20)
      break;

    default:
      break;
  }

})

//функция, которая генерит товары на странице по выбору из section
function generateLimitProd(count) { //count-кол-во генерируемых продуктов
  $spinner.classList.remove("hidden")//спинер показывается
  api.getLimitResult(count).then((res) => { //вызываем у апи метод выведения карточек, потом ждем ответ от сервера (.then((res))
    return res.json() //возвращаем результат в формате для js
  })
    .then((data) => { //ждем пока вернется рез-т в в формате для js
      $wrapper.innerHTML = null; //обнуляем контейнер для товаров

      //все, что внутри setTimeout выполнится с задержкой 500милисек.
      setTimeout(() => {
        data.forEach(element => {
          $spinner.classList.add("hidden")//добавляем класс, спинер скрывается
          //insertAdjacentHTML("beforeend") - добавляет элемент в разметку по указанной позиции
          $wrapper.insertAdjacentHTML("beforeend", generateProductHtml(element))//добавляются по функции html-эл с разметкой
        });
      }, 500)
    })
}

//условия выбора section - сортировка по цене
$selectSort.addEventListener("change", () => { //метод change - следит за любыми изменениями элемента
  const selectIndex = $selectSort.selectedIndex  //selectedIndex- получаем индекс выбранного option

  switch (selectIndex) {
    case 0:
      filterProductsMinMax(0)  //сортировка по возрастанию цены
      break;
    case 1:
      filterProductsMinMax(1)//сортировка по убыванию цены
      break;
    case 2:
      generateLimitProd(20)
      break;

    default:
      break;
  }
})

//функция сортировки по возрастанию-убыванию цены
function filterProductsMinMax(cases) {
  $spinner.classList.remove("hidden")//спинер показывается

  api.getProduct().then((res) => {
    return res.json() //возвращаем результат в формате для js
  })
    .then((data) => { //ждем пока вернется рез-т в в формате для js
      $wrapper.innerHTML = null; //обнуляем контейнер для товаров

      if (cases == 0) {
        data.sort((a, b) => {
          return a.price - b.price
        })
      } else if (cases == 1) {
        data.sort((a, b) => {
          return b.price - a.price
        })
      }

      setTimeout(() => {
        data.forEach(element => {
          $spinner.classList.add("hidden")//добавляем класс, спинер скрывается
          //insertAdjacentHTML("beforeend") - добавляет элемент в разметку по указанной позиции
          $wrapper.insertAdjacentHTML("beforeend", generateProductHtml(element))//добавляются по функции html-эл с разметкой
        });
      }, 500)
    })
}
