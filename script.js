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
  "Магазин (с торговой площадью от 100 до 200 кв.м.)",
  "Магазин (с торговой площадью от 50 до 100 кв.м.)",
  "Магазин (с торговой площадью до 50 кв.м.)",
  "Медицинская лаборатория",
  "Медицинский центр (более 150 кв.м.)",
  "Медицинский центр (до 150 кв.м.)",
  "Кафе / Ресторан / Чайхана (200+ мест)",
  "Кафе / Ресторан / Чайхана (100–200 мест)",
  "Кафе / Ресторан / Чайхана (до 100 мест)",
  "Сеть быстрого питания",
  "Бутик / Магазин в ТЦ (200+ кв.м.)",
  "Бутик / Магазин в ТЦ (100–200 кв.м.)",
  "Бутик / Магазин в ТЦ (50–100 кв.м.)",
  "Бутик / Магазин в ТЦ (до 50 кв.м.)",
  "Ветеринарная клиника",
  "Аптека",
  "Платёжный терминал",
  "Вендинговый аппарат",
  "Сауна / Баня",
  "Бильярдный клуб",
  "Ночной клуб / Караоке",
  "Автостоянка 24/7",
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
  "Торговля ГСМ",
  "Торговля газом",
  "Продажа авиабилетов",
  "Ветеринарные товары",
  "Фармацевтические товары",
  "Продажа медицинских товаров",
  "Продажа продуктов питания",
  "Продажа алкогольных напитков",
  "Продажа табачных изделий",
  "Торговля электроникой",
  "Одежда / Обувь",
  "Строительные материалы",
  "Цветы / Семена / Растения",
  "Зоотовары",
  "Ювелирные изделия",
  "Запчасти",
  "Бытовые товары",
  "Услуги медицинских центров",
  "Услуги общепита",
  "Услуги фаст-фуда",
  "Услуги салонов красоты",
  "Услуги нотариуса / адвоката",
  "Услуги автомоек",
  "Услуги гостиниц",
  "Услуги СТО",
  "Услуги доставки",
  "Услуги обучения",
  "Услуги уборки",
  "Услуги кинотеатров",
  "Услуги спортивных залов",
  "Услуги фотосалонов",
  "Услуги караоке / клубов",
  "Услуги интернет-клубов",
  "Услуги аренды имущества",
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
    const key = el.getAttribute("data-key");
    const tr = translations?.[lang]?.[key];
    if (!tr) return;

    // Пропуск INPUT, TEXTAREA, SELECT, MAP
    if (["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName)) return;
    if (el.classList.contains("no-translate")) return;

    el.textContent = tr;
  });

  document.querySelectorAll("[data-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-placeholder");
    const tr = translations?.[lang]?.[key];
    if (tr) el.placeholder = tr;
  });

  localStorage.setItem("lang", lang);
}

applyTranslations(savedLang);

langSelect.addEventListener("change", () => {
  const lang = langSelect.value;
  applyTranslations(lang);
});


/* ============================================================
   AUTO-SAVE FIELDS
============================================================ */
const autoSaveFields = [
  "companyName", "companyBin", "companyHead",
  "phone", "email", "manager",
  "legalAddress", "tradeAddress",
  "legalLat", "legalLon",
  "tradeLat", "tradeLon",
  "businessObjectType", "activityType",
  "posModel", "description"
];

autoSaveFields.forEach((id) => {
  const el = document.getElementById(id);
  if (!el) return;

  const saved = localStorage.getItem(id);
  if (saved) el.value = saved;

  el.addEventListener("input", () => {
    localStorage.setItem(id, el.value);
  });
});


/* ============================================================
   POPULATE DROPDOWNS
============================================================ */
{
  const businessObjectType = document.getElementById("businessObjectType");
  const activityType = document.getElementById("activityType");

  if (businessObjectType) {
    businessObjects.forEach((v) => {
      const opt = document.createElement("option");
      opt.value = v;
      opt.textContent = v;
      businessObjectType.appendChild(opt);
    });

    const saved = localStorage.getItem("businessObjectType");
    if (saved) businessObjectType.value = saved;
  }

  if (activityType) {
    activityTypes.forEach((v) => {
      const opt = document.createElement("option");
      opt.value = v;
      opt.textContent = v;
      activityType.appendChild(opt);
    });

    const saved = localStorage.getItem("activityType");
    if (saved) activityType.value = saved;
  }
}


/* ============================================================
   POS MODEL
============================================================ */
const posModel = document.getElementById("posModel");
if (posModel) {
  const saved = localStorage.getItem("posModel");
  if (saved) posModel.value = saved;

  posModel.addEventListener("change", () => {
    localStorage.setItem("posModel", posModel.value);
  });
}


/* ============================================================
   LEAFLET MAPS + GEOCODING
============================================================ */
function initMap(mapId, addressId, latId, lonId) {

  const defaultLat = 42.8746;
  const defaultLon = 74.5698;

  const map = L.map(mapId).setView([defaultLat, defaultLon], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19
  }).addTo(map);

  const marker = L.marker([defaultLat, defaultLon], { draggable: true }).addTo(map);

  function updateFields(lat, lon) {
    document.getElementById(latId).value = lat.toFixed(6);
    document.getElementById(lonId).value = lon.toFixed(6);
    localStorage.setItem(latId, lat.toFixed(6));
    localStorage.setItem(lonId, lon.toFixed(6));

    // Reverse geocoding → текстовый адрес
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&accept-language=ru&lat=${lat}&lon=${lon}`)
      .then(r => r.json())
      .then(data => {
        if (data?.display_name) {
          document.getElementById(addressId).value = data.display_name;
          localStorage.setItem(addressId, data.display_name);
        }
      })
      .catch(() => {});
  }

  marker.on("dragend", (e) => {
    const pos = e.target.getLatLng();
    updateFields(pos.lat, pos.lng);
  });

  map.on("click", (e) => {
    marker.setLatLng(e.latlng);
    updateFields(e.latlng.lat, e.latlng.lng);
  });

  // Restore if exists
  const savedLat = localStorage.getItem(latId);
  const savedLon = localStorage.getItem(lonId);

  if (savedLat && savedLon) {
    const lat = parseFloat(savedLat);
    const lon = parseFloat(savedLon);
    marker.setLatLng([lat, lon]);
    map.setView([lat, lon], 15);
    updateFields(lat, lon);
  } else {
    updateFields(defaultLat, defaultLon);
  }

  return map;
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

  const opt = {
    margin: 10,
    filename: "Demir_POS_Form.pdf",
    html2canvas: { scale: 2 },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
  };

  html2pdf().set(opt).from(element).save();
});


/* ============================================================
   TABLE AUTO-SAVE
============================================================ */
document.querySelectorAll(".tbl input").forEach((input) => {
  const saved = localStorage.getItem(input.id);
  if (saved) input.value = saved;

  input.addEventListener("input", () => {
    localStorage.setItem(input.id, input.value);
  });
});


/* ============================================================
   SIMPLE SPELLCHECK MOCK
============================================================ */
const spellPanel = document.getElementById("spellcheckPanel");
const spellFields = ["companyName", "companyHead", "description"];

function fakeSpellCheck() {
  spellPanel.innerHTML = "";

  spellFields.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;

    el.value.split(/\s+/).forEach((w) => {
      if (w.length > 5 && Math.random() < 0.03) {
        const div = document.createElement("div");
        div.textContent = `Возможная ошибка: «${w}»`;
        spellPanel.appendChild(div);
      }
    });
  });
}

setInterval(fakeSpellCheck, 2500);
