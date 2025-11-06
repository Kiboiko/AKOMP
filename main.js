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
    // Исправлено: параметр comment вместо product
    return `
            <div class="comment-card" data-id="${comment.id}">
                <img src="${comment.image}" alt="${comment.name}" class="comment-image">
                <div class="comment-description">${comment.description}</div>
                <div class="comment-name">${comment.name}</div> <!-- Исправлено: comment.name вместо product.name -->
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

// Загружаем товары при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
  productManager.loadProducts();
  commentsManager.loadComments();
});
