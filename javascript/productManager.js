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

const productManager = new ProductManager();

document.addEventListener("DOMContentLoaded", () => {
  const productsContainer = document.getElementById("productsContainer");
  productManager.loadProducts();
});
