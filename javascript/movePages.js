document.addEventListener("DOMContentLoaded", function () {
  // Обработчик для ссылок, ведущих на другую страницу с якорями
  document.querySelectorAll("#headermenu a").forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      // Если ссылка ведет на index.html с якорем
      if (href.includes("index.html#")) {
        e.preventDefault();

        // Сохраняем целевой якорь
        const targetAnchor = href.split("#")[1];

        // Сохраняем якорь в sessionStorage для использования на главной странице
        sessionStorage.setItem("targetAnchor", targetAnchor);

        // Переходим на главную страницу
        window.location.href = "index.html";
      }
      // Если ссылка ведет просто на index.html (главная)
      else if (href === "index.html") {
        e.preventDefault();
        // Очищаем сохраненный якорь для главной страницы
        sessionStorage.removeItem("targetAnchor");
        window.location.href = "index.html";
      }
      // Если ссылка ведет на текущую страницу с якорем (например, ./index.html#anchor)
      else if (href.startsWith("./index.html#")) {
        e.preventDefault();

        // Сохраняем целевой якорь
        const targetAnchor = href.split("#")[1];
        sessionStorage.setItem("targetAnchor", targetAnchor);

        // Переходим на главную страницу
        window.location.href = "index.html";
      }
    });
  });

  // Инициализация мобильного меню
  function initMobileMenu() {
    const headerDiv = document.querySelector(".header > div");
    const headerMenu = document.getElementById("headermenu");

    // Проверяем, есть ли уже кнопка мобильного меню
    if (document.querySelector(".mobile-menu-btn")) {
      return;
    }

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

  // Инициализируем мобильное меню
  initMobileMenu();

  // Обработчик изменения размера окна
  window.addEventListener("resize", function () {
    const headerMenu = document.getElementById("headermenu");
    const menuBtn = document.querySelector(".mobile-menu-btn");

    // На больших экранах скрываем мобильное меню и восстанавливаем прокрутку
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
  });
});
