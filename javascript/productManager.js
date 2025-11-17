class ProductManager {
  constructor() {
    this.products = [];
    this.container = document.getElementById("productsContainer");
    this.modal = null;
    this.currentProduct = null;
  }

  async loadProducts() {
    try {
      const response = await fetch("products.json");
      const data = await response.json();
      this.products = data.products;
      this.renderProducts();
      this.initModal();
    } catch (error) {
      console.error("Ошибка загрузки товаров:", error);
    }
  }

  formatPrice(price) {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
    }).format(price);
  }

  createProductCard(product) {
    return `
      <div class="product-card" data-id="${product.id}">
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <div class="product-name">${product.name}</div>
        <div class="product-description">${product.description}</div>
        <div class="product-price">${this.formatPrice(product.price)}</div>
        <button class="more-info-button" data-id="${product.id}">
          Подробнее
        </button>
      </div>
    `;
  }

  renderProducts() {
    this.container.innerHTML = this.products
      .map((product) => this.createProductCard(product))
      .join("");

    // Добавляем обработчики для кнопок
    this.container.querySelectorAll(".more-info-button").forEach((button) => {
      button.addEventListener("click", (e) => {
        const productId = parseInt(e.target.getAttribute("data-id"));
        this.openModal(productId);
      });
    });
  }

  initModal() {
    // Создаем модальное окно
    this.modal = document.createElement("div");
    this.modal.className = "product-modal";
    this.modal.innerHTML = `
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <button class="modal-close">&times;</button>
        <div class="modal-body">
          <div class="product-gallery">
            <div class="main-image">
              <img src="" alt="Основное изображение">
            </div>
            <div class="image-thumbnails"></div>
          </div>
          <div class="product-details">
            <h2 class="product-full-name"></h2>
            <div class="product-price-large"></div>
            
            <div class="details-section">
              <h3>Состав продукта</h3>
              <p class="product-composition"></p>
            </div>
            
            <div class="details-section">
              <h3>Характеристики продукта</h3>
              <p class="product-characteristics"></p>
            </div>
            
            <div class="details-section">
              <h3>Рекомендации к применению</h3>
              <p class="product-recommendations"></p>
            </div>
            
            <div class="details-grid">
              <div class="nutrition-section">
                <h3>Пищевая ценность на 100г</h3>
                <div class="nutrition-values">
                  <div class="nutrition-item">
                    <span>Жиры</span>
                    <span class="nutrition-value fat"></span>
                  </div>
                  <div class="nutrition-item">
                    <span>Белки</span>
                    <span class="nutrition-value protein"></span>
                  </div>
                  <div class="nutrition-item">
                    <span>Углеводы</span>
                    <span class="nutrition-value carbs"></span>
                  </div>
                  <div class="nutrition-item">
                    <span>Сахароза</span>
                    <span class="nutrition-value sugar"></span>
                  </div>
                  <div class="nutrition-item">
                    <span>Калории</span>
                    <span class="nutrition-value calories"></span>
                  </div>
                </div>
              </div>
              
              <div class="specs-section">
                <h3>Спецификации</h3>
                <div class="specs-values">
                  <div class="spec-item">
                    <span>Объём упаковки:</span>
                    <span class="spec-value weight"></span>
                  </div>
                  <div class="spec-item">
                    <span>Вид упаковки:</span>
                    <span class="spec-value package"></span>
                  </div>
                  <div class="spec-item">
                    <span>Стандарт:</span>
                    <span class="spec-value standard"></span>
                  </div>
                  <div class="spec-item">
                    <span>Срок хранения:</span>
                    <span class="spec-value shelfLife"></span>
                  </div>
                  <div class="spec-item">
                    <span>Условия хранения:</span>
                    <span class="spec-value storage"></span>
                  </div>
                </div>
              </div>
            </div>

            <div class="logistics-section">
              <h3>Логистика</h3>
              <div class="logistics-grid">
                <div class="logistics-item">
                  <span>Количество единиц в коробе:</span>
                  <span class="logistics-value unitsPerBox"></span>
                </div>
                <div class="logistics-item">
                  <span>Количество на поддоне:</span>
                  <span class="logistics-value unitsPerPallet"></span>
                </div>
                <div class="logistics-item">
                  <span>Фура:</span>
                  <span class="logistics-value truckCapacity"></span>
                </div>
                <div class="logistics-item">
                  <span>Нетто:</span>
                  <span class="logistics-value netWeight"></span>
                </div>
                <div class="logistics-item">
                  <span>Брутто:</span>
                  <span class="logistics-value grossWeight"></span>
                </div>
              </div>
            </div>

            <div class="additional-info">
              <div class="info-item">
                <strong>Образцы:</strong> <span class="samples-info"></span>
              </div>
              <div class="info-item">
                <strong>Условия поставки:</strong> <span class="price-note"></span>
              </div>
              <div class="info-item">
                <strong>Адрес производства:</strong> <span class="production-address"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(this.modal);

    // Обработчики закрытия модального окна
    this.modal.querySelector(".modal-close").addEventListener("click", () => {
      this.closeModal();
    });

    this.modal.querySelector(".modal-overlay").addEventListener("click", () => {
      this.closeModal();
    });

    // Закрытие по ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.modal.classList.contains("active")) {
        this.closeModal();
      }
    });
  }

  openModal(productId) {
    this.currentProduct = this.products.find((p) => p.id === productId);
    if (!this.currentProduct) return;

    const detailed = this.currentProduct.detailed;
    const specs = detailed.specifications;

    // Заполняем данные
    this.modal.querySelector(".product-full-name").textContent =
      detailed.fullName;
    this.modal.querySelector(".product-price-large").textContent =
      this.formatPrice(this.currentProduct.price);
    this.modal.querySelector(".product-composition").textContent =
      detailed.composition;
    this.modal.querySelector(".product-characteristics").textContent =
      detailed.characteristics;
    this.modal.querySelector(".product-recommendations").textContent =
      detailed.recommendations;

    // Пищевая ценность
    this.modal.querySelector(
      ".fat"
    ).textContent = `${detailed.nutrition.fat} г`;
    this.modal.querySelector(
      ".protein"
    ).textContent = `${detailed.nutrition.protein} г`;
    this.modal.querySelector(
      ".carbs"
    ).textContent = `${detailed.nutrition.carbs} г`;
    this.modal.querySelector(
      ".sugar"
    ).textContent = `${detailed.nutrition.sugar} г`;
    this.modal.querySelector(
      ".calories"
    ).textContent = `${detailed.nutrition.calories} ккал`;

    // Спецификации
    this.modal.querySelector(".weight").textContent = specs.weight;
    this.modal.querySelector(".package").textContent = specs.package;
    this.modal.querySelector(".standard").textContent = specs.standard;
    this.modal.querySelector(".shelfLife").textContent = specs.shelfLife;
    this.modal.querySelector(".storage").textContent = specs.storage;

    // Логистика
    this.modal.querySelector(".unitsPerBox").textContent = specs.unitsPerBox;
    this.modal.querySelector(".unitsPerPallet").textContent =
      specs.unitsPerPallet;
    this.modal.querySelector(".truckCapacity").textContent =
      specs.truckCapacity;
    this.modal.querySelector(".netWeight").textContent = specs.netWeight;
    this.modal.querySelector(".grossWeight").textContent = specs.grossWeight;

    // Дополнительная информация
    this.modal.querySelector(".samples-info").textContent = detailed.samples;
    this.modal.querySelector(".price-note").textContent = detailed.priceNote;
    this.modal.querySelector(".production-address").textContent =
      detailed.productionAddress;

    // Галерея изображений
    this.updateGallery();

    // Показываем модальное окно
    this.modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  updateGallery() {
    const mainImage = this.modal.querySelector(".main-image img");
    const thumbnailsContainer = this.modal.querySelector(".image-thumbnails");

    // Все изображения (основное + дополнительные)
    const allImages = [
      this.currentProduct.image,
      ...(this.currentProduct.detailed.additionalImages || []),
    ];

    // Устанавливаем основное изображение
    mainImage.src = allImages[0];
    mainImage.alt = this.currentProduct.name;

    // Создаем миниатюры
    thumbnailsContainer.innerHTML = allImages
      .map(
        (imgSrc, index) => `
      <div class="thumbnail ${
        index === 0 ? "active" : ""
      }" data-index="${index}">
        <img src="${imgSrc}" alt="${this.currentProduct.name} - фото ${
          index + 1
        }">
      </div>
    `
      )
      .join("");

    // Обработчики для миниатюр
    thumbnailsContainer.querySelectorAll(".thumbnail").forEach((thumb) => {
      thumb.addEventListener("click", () => {
        const index = parseInt(thumb.getAttribute("data-index"));
        mainImage.src = allImages[index];

        // Обновляем активную миниатюру
        thumbnailsContainer
          .querySelectorAll(".thumbnail")
          .forEach((t) => t.classList.remove("active"));
        thumb.classList.add("active");
      });
    });
  }

  closeModal() {
    this.modal.classList.remove("active");
    document.body.style.overflow = "";
  }
}

const productManager = new ProductManager();

document.addEventListener("DOMContentLoaded", () => {
  const productsContainer = document.getElementById("productsContainer");
  if (productsContainer) {
    productManager.loadProducts();
  }
});
