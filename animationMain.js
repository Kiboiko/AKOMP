// Функция для инициализации анимации слогана
function initSloganAnimation() {
  const sloganElement = document.getElementById("sloganMain");
  const descriptionElement = document.getElementById("descriptionMain");
  const buttonElement = document.getElementById("toAboutButton");

  // Сбрасываем анимации при загрузке
  setTimeout(() => {
    sloganElement.style.animation = "fadeInUp 1s ease forwards 0.5s";
    descriptionElement.style.animation = "fadeInUp 0.8s ease forwards 1s";
    buttonElement.style.animation = "fadeInUp 0.8s ease forwards 1.5s";
  }, 100);
}

// Функция для создания эффекта волны (опционально)
function createWaveEffect() {
  const sloganText = "АКОМП ЮГ - производство и реализация сгущённого молока.";
  const sloganElement = document.getElementById("sloganMain");

  // Очищаем текущий контент
  sloganElement.innerHTML = "";

  // Создаем span для каждой буквы
  sloganText.split("").forEach((letter, index) => {
    const span = document.createElement("span");
    span.textContent = letter;
    span.style.animation = `wave 1.5s ease-in-out ${index * 0.05}s`;
    span.style.display = "inline-block";
    sloganElement.appendChild(span);
  });
}

// Функция для перезапуска анимации
function restartAnimation() {
  const elements = [
    document.getElementById("sloganMain"),
    document.getElementById("descriptionMain"),
    document.getElementById("toAboutButton"),
  ];

  // Сбрасываем анимации
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

  // Опционально: можно раскомментировать для волнового эффекта
  // createWaveEffect();
});

// Добавьте обработчик для кнопки (если хотите возможность перезапуска)
// Например, можно добавить скрытую кнопку для тестирования:
function addRestartButton() {
  const restartBtn = document.createElement("button");
  restartBtn.textContent = "Перезапустить анимацию";
  restartBtn.style.position = "fixed";
  restartBtn.style.bottom = "20px";
  restartBtn.style.right = "20px";
  restartBtn.style.zIndex = "1000";
  restartBtn.style.padding = "10px";
  restartBtn.style.background = "var(--bg-blue-color)";
  restartBtn.style.color = "white";
  restartBtn.style.border = "none";
  restartBtn.style.borderRadius = "5px";
  restartBtn.style.cursor = "pointer";

  restartBtn.addEventListener("click", restartAnimation);
  document.body.appendChild(restartBtn);
}

// Раскомментируйте, если нужна кнопка перезапуска
// addRestartButton();
