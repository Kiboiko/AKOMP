class ProductManager {
  constructor() {
    this.products = [];
    this.container = document.getElementById("productsContainer");
  }

  // Метод для загрузки данных
  async loadProducts() {
    try {
      const response = await fetch("products.json");
      this.products = await response.json();
      this.renderProducts();
    } catch (error) {
      console.error("Ошибка загрузки товаров:", error);
    }
  }

  //Метод для определения самого длинного описания
  getLongestDescription() {
    let longest = -1;
    this.products.forEach((product) => {
      if (product.description.length > longest) {
        longest = product.description.length;
      }
    });
    return longest;
  }

  // Метод для форматирования цены
  formatPrice(price) {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
    }).format(price);
  }

  // Метод для создания HTML карточки
  createProductCard(product) {
    let formatDescription =
      product.description +
      " ".repeat(this.getLongestDescription() - product.description.length);
    return `
            <div class="product-card" data-id="${product.id}">
                <img src="${product.image}" alt="${
      product.name
    }" class="product-image">
                <div class="product-name">${product.name}</div>
                <div class="product-description">${formatDescription}</div>
                <div class="product-price">${this.formatPrice(
                  product.price
                )}</div>
                <button class="more-info-button">
                    Подробнее
                </button>
            </div>
        `;
  }

  // Метод для отрисовки всех карточек
  renderProducts() {
    this.container.innerHTML = this.products
      .map((product) => this.createProductCard(product))
      .join("");
  }
}

class CommentsManager {
  constructor() {
    this.comments = [];
    this.container = document.getElementById("commentsContainer");
  }

  async loadComments() {
    try {
      const response = await fetch("comments.json");
      this.comments = await response.json();
      this.renderComments();
      console.log(this.comments);
    } catch (error) {
      console.error("Ошибка загрузки комментариев:", error);
    }
  }

  createCommentCard(comment) {
    return `
            <div class="comment-card" data-id="${comment.id}">
                <img src="${comment.image}" alt="${comment.name}" class="comment-image">
                <div class="comment-description">${comment.description}</div>
                <div class="comment-name">${comment.name}</div>
            </div>
        `;
  }

  renderComments() {
    this.container.innerHTML = this.comments
      .map((comment) => this.createCommentCard(comment))
      .join("");
  }
}

const productManager = new ProductManager();
const commentsManager = new CommentsManager();

// Функция для мобильного меню
function initMobileMenu() {
  const menuBtn = document.createElement("button");
  menuBtn.className = "mobile-menu-btn";
  menuBtn.innerHTML = "☰";
  menuBtn.setAttribute("aria-label", "Открыть меню");

  const headerMenu = document.getElementById("headermenu");
  const headerDiv = document.querySelector(".header > div");

  // Вставляем кнопку перед логотипом
  headerDiv.insertBefore(menuBtn, headerDiv.firstChild);

  menuBtn.addEventListener("click", function () {
    headerMenu.classList.toggle("active");
    menuBtn.innerHTML = headerMenu.classList.contains("active") ? "✕" : "☰";
  });

  // Закрытие меню при клике на ссылку
  headerMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      headerMenu.classList.remove("active");
      menuBtn.innerHTML = "☰";
    });
  });
}

// Загружаем товары при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
  productManager.loadProducts();
  commentsManager.loadComments();
  initMobileMenu(); // Инициализируем мобильное меню
});

document.querySelectorAll("#headermenu a").forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();

    const targetId = this.getAttribute("href").substring(1);
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      const headerHeight = document.querySelector(".header").offsetHeight;
      const targetPosition = targetElement.offsetTop - headerHeight - 20;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  });
});

// Обработчик изменения размера окна
window.addEventListener("resize", function () {
  const headerMenu = document.getElementById("headermenu");
  const menuBtn = document.querySelector(".mobile-menu-btn");

  // На больших экранах скрываем мобильное меню
  if (window.innerWidth > 768) {
    headerMenu.classList.remove("active");
    if (menuBtn) menuBtn.innerHTML = "☰";
  }
});
