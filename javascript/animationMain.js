function initSloganAnimation() {
  const sloganElement = document.getElementById("sloganMain");
  const descriptionElement = document.getElementById("descriptionMain");
  const buttonElement = document.getElementById("toAboutButton");
  setTimeout(() => {
    sloganElement.style.animation = "fadeInUp 1s ease forwards 0.5s";
    descriptionElement.style.animation = "fadeInUp 0.8s ease forwards 1s";
    buttonElement.style.animation = "fadeInUp 0.8s ease forwards 1.5s";
  }, 100);
}

// Функция для перезапуска анимации
function restartAnimation() {
  const elements = [
    document.getElementById("sloganMain"),
    document.getElementById("descriptionMain"),
    document.getElementById("toAboutButton"),
  ];
  elements.forEach((element) => {
    if (element) {
      element.style.animation = "none";
    }
  });

  // Перезапускаем анимации
  setTimeout(() => {
    const sloganElement = document.getElementById("sloganMain");
    const descriptionElement = document.getElementById("descriptionMain");
    const buttonElement = document.getElementById("toAboutButton");

    if (sloganElement) {
      sloganElement.style.animation = "fadeInUp 1s ease forwards 0.5s";
    }
    if (descriptionElement) {
      descriptionElement.style.animation = "fadeInUp 0.8s ease forwards 1s";
    }
    if (buttonElement) {
      buttonElement.style.animation = "fadeInUp 0.8s ease forwards 1.5s";
    }
  }, 50);
}

// Инициализация анимации при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
  initSloganAnimation();
});

document.addEventListener("click", function (e) {
  if (e.target.tagName === "A") {
    if (e.target.classList.contains("MainButton")) {
      restartAnimation();
    }
  }
});
