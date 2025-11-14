/* ============================================================
   THEME TOGGLE
============================================================ */
const themeToggle = document.getElementById("themeToggle");
const body = document.body;

const savedTheme = localStorage.getItem("theme") || "light";
body.classList.add(savedTheme);
themeToggle.value = savedTheme;

themeToggle.addEventListener("change", () => {
  const theme = themeToggle.value;
  body.classList.remove("light", "dark");
  body.classList.add(theme);
  localStorage.setItem("theme", theme);
});

/* ============================================================
   BUSINESS OBJECT TYPES
============================================================ */
const businessObjects = [
  "Автомобильная заправочная станция (АЗС)",
  "Автомобильная газонаполнительная компрессорная станция (АГНКС)",
  "Автомобильная газозаправочная станция (АГЗС)",
  "Магазин (с торговой площадью более 200 кв.м.)",
  "Магазин (100–200 кв.м.)",
  "Магазин (50–100 кв.м.)",
  "Магазин (до 50 кв.м.)",
  "Медицинская лаборатория",
  "Медицинский центр (более 150 кв.м.)",
  "Медицинский центр (до 150 кв.м.)",
  "Кафе/Ресторан (200+ мест)",
  "Кафе/Ресторан (100–200 мест)",
  "Кафе/Ресторан (до 100 мест)",
  "Сеть быстрого питания (фаст-фуд)",
  "Бутик/Магазин в ТЦ (200+ кв.м.)",
  "Бутик/Магазин в ТЦ (100–200 кв.м.)",
  "Бутик/Магазин в ТЦ (50–100 кв.м.)",
  "Бутик/Магазин в ТЦ (до 50 кв.м.)",
  "Ветеринарная клиника",
  "Аптека",
  "Платёжный терминал",
  "Вендинговый аппарат",
  "Сауна / Баня",
  "Бильярдный клуб",
  "Ночной клуб / Караоке",
  "Автостоянка круглосуточная",
  "Ломбард",
  "Парикмахерская / Салон красоты",
  "Стоматология",
  "Мойка авто",
  "Гостиница / Дом отдыха / Коттедж",
  "СТО",
  "Вулканизация",
  "Нотариус / Адвокат",
  "Павильон / Контейнер / Киоск",
  "Бассейн",
  "Образовательное учреждение",
  "Игровой клуб",
  "Химчистка",
  "Спортивный зал",
  "Прочее"
];

/* ============================================================
   ACTIVITY TYPES
============================================================ */
const activityTypes = [
  "Розничная торговля",
  "Продажа ГСМ",
  "Продажа газа",
  "Продажа авиабилетов",
  "Ветеринарные товары",
  "Фармацевтические товары",
  "Медицинские товары",
  "Продукты питания",
  "Алкогольные напитки",
  "Табачные изделия",
  "Электроника",
  "Одежда / Обувь",
  "Строительные материалы",
  "Цветы / Растения / Семена",
  "Зоотовары",
  "Ювелирные изделия",
  "Запчасти",
  "Бытовые товары",
  "Услуги медцентров",
  "Общепит",
  "Фаст-фуд",
  "Салон красоты",
  "Нотариус / Адвокат",
  "Автомойка",
  "Гостиница",
  "СТО",
  "Доставка",
  "Обучение",
  "Уборка",
  "Кинотеатр",
  "Спортивный зал",
  "Фотосалон",
  "Караоке / Клуб",
  "Интернет-клуб",
  "Аренда имущества",
  "Прочие услуги"
];

/* ============================================================
   LANGUAGE SWITCH
============================================================ */
const langSelect = document.getElementById("langSelect");
const savedLang = localStorage.getItem("lang") || "ru";
langSelect.value = savedLang;

function applyTranslations(lang) {
  document.querySelectorAll("[data-key]").forEach((el) => {
    if (["SELECT", "INPUT", "TEXTAREA"].includes(el.tagName)) return;
    if (el.classList.contains("no-translate")) return;

    const key = el.getAttribute("data-key");
    const tr = translations[lang]?.[key];
    if (tr) el.textContent = tr;
  });

  document.querySelectorAll("[data-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-placeholder");
    if (translations[lang]?.[key]) el.placeholder = translations[lang][key];
  });

  localStorage.setItem("lang", lang);
}

applyTranslations(savedLang);

langSelect.addEventListener("change", () => {
  applyTranslations(langSelect.value);
});

/* ============================================================
   AUTO-SAVE FORM
============================================================ */
const autoFields = [
  "companyName", "companyBin", "companyHead",
  "phone", "email", "manager",
  "legalAddress", "tradeAddress",
  "legalLat", "legalLon",
  "tradeLat", "tradeLon",
  "businessObjectType", "activityType",
  "posModel", "description"
];

autoFields.forEach((id) => {
  const el = document.getElementById(id);
  if (!el) return;
  const saved = localStorage.getItem(id);
  if (saved) el.value = saved;
  el.addEventListener("input", () => localStorage.setItem(id, el.value));
});

/* ============================================================
   FILL SELECTS (business + activity)
============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  const bo = document.getElementById("businessObjectType");
  const at = document.getElementById("activityType");

  if (bo) {
    businessObjects.forEach(v => bo.append(new Option(v, v)));
    const saved = localStorage.getItem("businessObjectType");
    if (saved) bo.value = saved;
    bo.addEventListener("change", () => localStorage.setItem("businessObjectType", bo.value));
  }

  if (at) {
    activityTypes.forEach(v => at.append(new Option(v, v)));
    const saved = localStorage.getItem("activityType");
    if (saved) at.value = saved;
    at.addEventListener("change", () => localStorage.setItem("activityType", at.value));
  }
});

/* ============================================================
   LEAFLET MAPS WITH REVERSE GEOCODING
============================================================ */
function initMap(mapId, addressId, latId, lonId) {
  const map = L.map(mapId).setView([42.8746, 74.5698], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19
  }).addTo(map);

  const marker = L.marker([42.8746, 74.5698], { draggable: true }).addTo(map);

  function update(lat, lon) {
    document.getElementById(latId).value = lat.toFixed(6);
    document.getElementById(lonId).value = lon.toFixed(6);

    localStorage.setItem(latId, lat.toFixed(6));
    localStorage.setItem(lonId, lon.toFixed(6));

    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=ru`)
      .then(r => r.json())
      .then(data => {
        if (data?.display_name) {
          document.getElementById(addressId).value = data.display_name;
          localStorage.setItem(addressId, data.display_name);
        }
      });
  }

  marker.on("dragend", e => {
    const pos = e.target.getLatLng();
    update(pos.lat, pos.lng);
  });

  map.on("click", e => {
    marker.setLatLng(e.latlng);
    update(e.latlng.lat, e.latlng.lng);
  });

  // Load saved
  const slat = localStorage.getItem(latId);
  const slon = localStorage.getItem(lonId);
  if (slat && slon) {
    const lat = parseFloat(slat);
    const lon = parseFloat(slon);
    marker.setLatLng([lat, lon]);
    map.setView([lat, lon], 15);
    update(lat, lon);
  } else {
    update(42.8746, 74.5698);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initMap("legalMap", "legalAddress", "legalLat", "legalLon");
  initMap("tradeMap", "tradeAddress", "tradeLat", "tradeLon");
});

/* ============================================================
   PDF EXPORT
============================================================ */
document.getElementById("savePdf")?.addEventListener("click", () => {
  const element = document.querySelector(".app-main");
  html2pdf()
    .set({
      margin: 10,
      filename: "Demir_POS_Form.pdf",
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
    })
    .from(element)
    .save();
});

/* ============================================================
   SIMPLE SPELLCHECK MOCK
============================================================ */
const spellPanel = document.getElementById("spellcheckPanel");

function fakeSpellCheck() {
  spellPanel.innerHTML = "";
  ["companyName", "companyHead", "description"].forEach(id => {
    const text = document.getElementById(id)?.value || "";
    text.split(/\s+/).forEach(w => {
      if (w.length > 6 && Math.random() < 0.03) {
        const div = document.createElement("div");
        div.textContent = `Возможная ошибка: "${w}"`;
        spellPanel.appendChild(div);
      }
    });
  });
}

setInterval(fakeSpellCheck, 2500);
