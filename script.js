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
  "Сеть быстрого питания",
  "Бутик в ТЦ (200+ кв.м.)",
  "Бутик в ТЦ (100–200 кв.м.)",
  "Бутик в ТЦ (50–100 кв.м.)",
  "Бутик в ТЦ (до 50 кв.м.)",
  "Ветеринарная клиника",
  "Аптека",
  "Платёжный терминал",
  "Вендинговый аппарат",
  "Сауна/Баня",
  "Бильярдный клуб",
  "Ночной клуб / Караоке",
  "Автостоянка 24/7",
  "Ломбард",
  "Салон красоты",
  "Стоматология",
  "Мойка авто",
  "Гостиница / Коттедж",
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
    if (["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName)) return;
    if (el.classList.contains("no-translate")) return;

    const key = el.getAttribute("data-key");
    const tr = translations[lang]?.[key];
    if (tr) el.textContent = tr;
  });

  document.querySelectorAll("[data-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-placeholder");
    const tr = translations[lang]?.[key];
    if (tr) el.placeholder = tr;
  });

  localStorage.setItem("lang", lang);
}

applyTranslations(savedLang);

langSelect.addEventListener("change", () => {
  applyTranslations(langSelect.value);
});


/* ============================================================
   AUTO-SAVE FIELDS
============================================================ */
const autoFields = [
  "companyName", "companyBin", "companyHead",
  "phone", "email", "manager",
  "legalAddress", "tradeAddress",
  "legalLat", "legalLon",
  "tradeLat", "tradeLon",
  "businessObjectType", "activityType",
  "posModel", "description",
  "commission_card", "commission_elcart", "discount_10"
];

autoFields.forEach((id) => {
  const el = document.getElementById(id);
  if (!el) return;

  const saved = localStorage.getItem(id);
  if (saved) el.value = saved;

  el.addEventListener("input", () => localStorage.setItem(id, el.value));
});


/* ============================================================
   FILL DROPDOWNS
============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  const bo = document.getElementById("businessObjectType");
  const at = document.getElementById("activityType");

  businessObjects.forEach(v => bo.append(new Option(v, v)));
  activityTypes.forEach(v => at.append(new Option(v, v)));

  const savedBO = localStorage.getItem("businessObjectType");
  if (savedBO) bo.value = savedBO;

  const savedAT = localStorage.getItem("activityType");
  if (savedAT) at.value = savedAT;
});


/* ============================================================
   LEAFLET MAPS
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
      .then(d => {
        if (d?.display_name) {
          document.getElementById(addressId).value = d.display_name;
          localStorage.setItem(addressId, d.display_name);
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

  const savedLat = localStorage.getItem(latId);
  const savedLon = localStorage.getItem(lonId);

  if (savedLat && savedLon) {
    const lat = +savedLat, lon = +savedLon;
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
   PDF EXPORT — ОФИЦИАЛЬНЫЙ ШАБЛОН
============================================================ */

function fillPdfTemplate() {
  const fields = [
    ["companyName", "pdf_companyName"],
    ["companyBin", "pdf_companyBin"],
    ["companyHead", "pdf_companyHead"],
    ["phone", "pdf_phone"],
    ["email", "pdf_email"],
    ["legalAddress", "pdf_legalAddress"],
    ["tradeAddress", "pdf_tradeAddress"],
    ["businessObjectType", "pdf_businessObjectType"],
    ["activityType", "pdf_activityType"],
    ["posModel", "pdf_posModel"],
    ["description", "pdf_description"],
    ["commission_card", "pdf_comm_card"],
    ["commission_elcart", "pdf_comm_elcart"],
    ["discount_10", "pdf_discount_10"]
  ];

  fields.forEach(([src, dest]) => {
    document.getElementById(dest).textContent =
      document.getElementById(src)?.value || "";
  });
}

document.getElementById("savePdf")?.addEventListener("click", () => {
  fillPdfTemplate();

  const pdfDoc = document.getElementById("pdfDocument");

  html2pdf()
    .set({
      margin: 10,
      filename: "Demir_POS_Form.pdf",
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
    })
    .from(pdfDoc)
    .save();
});


/* ============================================================
   SIMPLE SPELLCHECK
============================================================ */
const spellPanel = document.getElementById("spellcheckPanel");

function fakeSpellCheck() {
  spellPanel.innerHTML = "";

  ["companyName", "companyHead", "description"].forEach(id => {
    const words = (document.getElementById(id)?.value || "").split(/\s+/);

    words.forEach(w => {
      if (w.length > 6 && Math.random() < 0.03) {
        const div = document.createElement("div");
        div.textContent = `Возможная ошибка: "${w}"`;
        spellPanel.appendChild(div);
      }
    });
  });
}

setInterval(fakeSpellCheck, 2500);
