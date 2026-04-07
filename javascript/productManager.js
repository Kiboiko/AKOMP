class ProductManager {
    constructor() {
        this.products = [];
        this.container = document.getElementById("productsContainer");
        this.modal = null;
        this.currentProduct = null;
    }

    async loadProducts() {
        try {
            const response = await fetch("/api/products");
            const data = await response.json();
            this.products = data.products;
            this.renderProducts();
            this.initModal();
        } catch (error) {
            console.error("Ошибка загрузки товаров:", error);
            if (this.container) {
                this.container.innerHTML = '<div style="text-align:center;padding:40px;">Ошибка загрузки товаров</div>';
            }
        }
    }

    formatPrice(price) {
        if (!price) return "";
        return new Intl.NumberFormat("ru-RU", {
            style: "currency",
            currency: "RUB",
        }).format(price);
    }

    createProductCard(product) {
        const imageUrl = product.image_url || "https://via.placeholder.com/300x200?text=No+Image";
        return `
            <div class="product-card" data-id="${product.id}">
                <img src="${imageUrl}" alt="${product.name}" class="product-image" onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
                <div class="product-name">${this.escapeHtml(product.name)}</div>
                <div class="product-description">Артикул: ${this.escapeHtml(product.article)}</div>
                <div class="product-price">${this.formatPrice(product.price)}</div>
                <button class="more-info-button" data-id="${product.id}">
                    Подробнее
                </button>
            </div>
        `;
    }
    
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    renderProducts() {
        if (!this.container) return;
        
        if (this.products.length === 0) {
            this.container.innerHTML = '<div style="text-align:center;padding:40px;">Товары скоро появятся</div>';
            return;
        }
        
        this.container.innerHTML = this.products
            .map((product) => this.createProductCard(product))
            .join("");

        this.container.querySelectorAll(".more-info-button").forEach((button) => {
            button.addEventListener("click", (e) => {
                const productId = parseInt(e.target.getAttribute("data-id"));
                this.openModal(productId);
            });
        });
    }

    initModal() {
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
                    </div>
                    <div class="product-details">
                        <h2 class="product-full-name"></h2>
                        <div class="details-section">
                            <h3>Артикул</h3>
                            <p class="product-article"></p>
                        </div>
                        <div class="details-section">
                            <h3>Цена</h3>
                            <p class="product-price"></p>
                        </div>
                        <div class="additional-info">
                            <div class="info-item">
                                <strong>ID товара:</strong> <span class="product-id"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(this.modal);

        this.modal.querySelector(".modal-close").addEventListener("click", () => {
            this.closeModal();
        });

        this.modal.querySelector(".modal-overlay").addEventListener("click", () => {
            this.closeModal();
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && this.modal.classList.contains("active")) {
                this.closeModal();
            }
        });
    }

    openModal(productId) {
        this.currentProduct = this.products.find((p) => p.id === productId);
        if (!this.currentProduct) return;

        const imageUrl = this.currentProduct.image_url || "https://via.placeholder.com/400x300?text=No+Image";
        
        this.modal.querySelector(".product-full-name").textContent = this.currentProduct.description || this.currentProduct.name;
        this.modal.querySelector(".product-article").textContent = this.currentProduct.article;
        this.modal.querySelector(".product-price").textContent = this.formatPrice(this.currentProduct.price);
        this.modal.querySelector(".product-id").textContent = this.currentProduct.id;
        this.modal.querySelector(".main-image img").src = imageUrl;
        this.modal.querySelector(".main-image img").alt = this.currentProduct.name;

        this.modal.classList.add("active");
        document.body.style.overflow = "hidden";
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