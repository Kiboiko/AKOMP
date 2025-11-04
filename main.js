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

  // Метод для форматирования цены
  formatPrice(price) {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
    }).format(price);
  }

  // Метод для создания HTML карточки
  createProductCard(product) {
    return `
            <div class="product-card" data-id="${product.id}">
                <img src="${product.image}" alt="${
      product.name
    }" class="product-image">
                <div class="product-name">${product.name}</div>
                <div class="product-description">${product.description}</div>
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

const productManager = new ProductManager();

// Загружаем товары при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
  productManager.loadProducts();
});
