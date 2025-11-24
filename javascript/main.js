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

const commentsManager = new CommentsManager();

// Функция для мобильного меню
function initMobileMenu() {
  const headerDiv = document.querySelector(".header > div");
  const headerMenu = document.getElementById("headermenu");

  // Создаем кнопку мобильного меню
  const menuBtn = document.createElement("button");
  menuBtn.className = "mobile-menu-btn";
  menuBtn.innerHTML = "☰";
  menuBtn.setAttribute("aria-label", "Открыть меню");
  menuBtn.setAttribute("aria-expanded", "false");

  // Добавляем кнопку в начало хедера
  headerDiv.prepend(menuBtn);

  // Обработчик клика по кнопке меню
  menuBtn.addEventListener("click", function () {
    const isActive = headerMenu.classList.contains("active");
    headerMenu.classList.toggle("active");
    menuBtn.innerHTML = isActive ? "☰" : "✕";
    menuBtn.setAttribute("aria-expanded", !isActive);

    // Блокируем прокрутку тела при открытом меню
    document.body.style.overflow = isActive ? "" : "hidden";
  });

  // Закрытие меню при клике на ссылку
  headerMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      headerMenu.classList.remove("active");
      menuBtn.innerHTML = "☰";
      menuBtn.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    });
  });

  // Закрытие меню при клике вне его области
  document.addEventListener("click", (e) => {
    if (
      !headerDiv.contains(e.target) &&
      headerMenu.classList.contains("active")
    ) {
      headerMenu.classList.remove("active");
      menuBtn.innerHTML = "☰";
      menuBtn.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }
  });

  // Закрытие меню при нажатии Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && headerMenu.classList.contains("active")) {
      headerMenu.classList.remove("active");
      menuBtn.innerHTML = "☰";
      menuBtn.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }
  });
}

// Загружаем товары при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
  const commentsContainer = document.getElementById("commentsContainer");
  if (commentsContainer) {
    commentsManager.loadComments();
  }

  initMobileMenu();
  initCommentsSectionObserver();
  initMobileTouchInteractions();
});
document.addEventListener("DOMContentLoaded", function () {
  const targetAnchor = sessionStorage.getItem("targetAnchor");

  if (targetAnchor) {
    // Даем время странице полностью загрузиться
    setTimeout(() => {
      const targetElement = document.getElementById(targetAnchor);

      if (targetElement) {
        const headerHeight = document.querySelector(".header").offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }

      // Очищаем сохраненный якорь после использования
      sessionStorage.removeItem("targetAnchor");
    }, 500);
  }
});
// Функция для отслеживания видимости раздела комментариев
function initCommentsSectionObserver() {
  const commentsSection = document.getElementById("commentsContainer-anchor");
  const hintElement = document.querySelector(".comments-to-products-hint");

  if (!commentsSection || !hintElement) return;

  // Настройки для разных устройств
  const isMobile = window.innerWidth <= 768;
  const observerOptions = isMobile
    ? {
        threshold: 0.2, // Ниже порог для мобильных
        rootMargin: "-30px 0px -30px 0px",
      }
    : {
        threshold: 0.3,
        rootMargin: "-50px 0px -50px 0px",
      };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Показываем подсказку с задержкой
        setTimeout(
          () => {
            hintElement.classList.add("visible");
          },
          isMobile ? 300 : 500
        ); // Меньшая задержка на мобильных
      } else {
        // Скрываем подсказку
        hintElement.classList.remove("visible");
      }
    });
  }, observerOptions);

  observer.observe(commentsSection);

  // Обработчик изменения ориентации экрана
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // Переинициализируем при значительном изменении размера
      if (Math.abs(window.innerWidth - (window.oldWidth || 0)) > 100) {
        observer.disconnect();
        initCommentsSectionObserver();
        window.oldWidth = window.innerWidth;
      }
    }, 250);
  });
}

// Дополнительная функция для touch-устройств
function initMobileTouchInteractions() {
  const hintBtn = document.querySelector(".products-hint-btn");
  if (!hintBtn) return;

  // Добавляем визуальный feedback при касании
  hintBtn.addEventListener(
    "touchstart",
    function () {
      this.style.transform = "scale(0.95)";
    },
    { passive: true }
  );

  hintBtn.addEventListener(
    "touchend",
    function () {
      this.style.transform = "";
    },
    { passive: true }
  );
}

// Плавная прокрутка для навигации
document.querySelectorAll("#headermenu a").forEach((link) => {
  link.addEventListener("click", function (e) {
    const href = this.getAttribute("href");

    // Разрешаем стандартное поведение для ссылки на products.html
    if (href === "products.html" || href === "./products.html") {
      return; // Не предотвращаем переход
    }
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

  if (window.innerWidth > 768) {
    if (headerMenu.classList.contains("active")) {
      headerMenu.classList.remove("active");
      if (menuBtn) {
        menuBtn.innerHTML = "☰";
        menuBtn.setAttribute("aria-expanded", "false");
      }
      document.body.style.overflow = "";
    }
  }

  // Переинициализируем observer при переходе между мобильным и десктопным режимом
  const oldIsMobile = window.wasMobile;
  const newIsMobile = window.innerWidth <= 768;

  if (oldIsMobile !== newIsMobile) {
    setTimeout(initCommentsSectionObserver, 100);
  }

  window.wasMobile = newIsMobile;
}); 
