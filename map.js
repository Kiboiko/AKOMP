function initMap() {
  ymaps.ready(function () {
    let coord = [47.092126, 39.396713];
    var map = new ymaps.Map("map", {
      center: coord,
      zoom: 17,
      controls: [
        "zoomControl", // Кнопки zoom +/-
        "fullscreenControl", // Полноэкранный режим
        "typeSelector", // Переключение тип карты (схема/спутник)
        "geolocationControl", // Геолокация (найти меня)
        // "rulerControl", // Линейка для измерения расстояний
      ],
    });

    var myPlacemark = new ymaps.Placemark(
      coord,
      {},
      {
        preset: "islands#redIcon",
      }
    );

    map.geoObjects.add(myPlacemark);
  });
}

// Инициализируем карту после загрузки DOM
document.addEventListener("DOMContentLoaded", function () {
  initMap();
});
