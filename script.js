/* ============================================================
   THEME TOGGLE
============================================================ */
const themeToggle = document.getElementById("themeToggle");
const body = document.body;

if (themeToggle) {
  const savedTheme = localStorage.getItem("theme") || "light";
  body.classList.add(savedTheme);
  themeToggle.value = savedTheme;

  themeToggle.addEventListener("change", () => {
    const theme = themeToggle.value;
    body.classList.remove("light", "dark");
    body.classList.add(theme);
    localStorage.setItem("theme", theme);
  });
}


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
  "Кафе/Ресторан/Чайхана (200+ мест)",
  "Кафе/Ресторан/Чайхана (100–200 мест)",
  "Кафе/Ресторан/Чайхана (до 100 мест)",
  "Сеть быстрого питания (фаст-фуд)",
  "Бутик/Магазин в ТЦ (200+ кв.м.)",
  "Бутик/Магазин в ТЦ (100–200 кв.м.)",
  "Бутик/Магазин в ТЦ (50–100 кв.м.)",
  "Бутик/Магазин в ТЦ (до 50 кв.м.)",
  "Ветеринарная клиника",
  "Ветеринарная аптека",
  "Аптека",
  "Аптечный пункт",
  "Платежный терминал",
  "Вендинговый аппарат",
  "Сауна",
  "Баня",
  "Бильярдный клуб",
  "Обменное бюро",
  "Дискотека/Ночной клуб",
  "Караоке",
  "Круглосуточная автостоянка",
  "Ломбард",
  "Парикмахерская/Салон красоты",
  "Стоматология",
  "Мойка автотранспортных средств",
  "Гостиница",
  "Дом отдыха / Частный коттедж",
  "СТО",
  "Вулканизация",
  "Нотариус/Адвокатская контора",
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
  "Розничная торговля широким ассортиментом товаров",
  "Розничная торговля ГСМ",
  "Розничная торговля автомобильным газом",
  "Розничная торговля авиабилетами",
  "Розничная торговля ветеринарными препаратами",
  "Розничная торговля фармацевтическими товарами",
  "Розничная торговля медицинскими и ортопедическими товарами",
  "Розничная торговля продуктами питания",
  "Розничная торговля алкогольными напитками",
  "Розничная торговля табачными изделиями",
  "Розничная торговля электроникой и бытовой техникой",
  "Розничная торговля одеждой и обувью",
  "Розничная торговля строительными материалами",
  "Розничная торговля цветами и растениями",
  "Розничная торговля зоотоварами",
  "Розничная торговля ювелирными изделиями",
  "Розничная торговля запасными частями",
  "Розничная торговля прочими товарами",
  "Услуги медицинских лабораторий / центров",
  "Услуги общественного питания",
  "Услуги сетей быстрого питания (фаст-фуд)",
  "Услуги салонов красоты",
  "Услуги нотариусов / адвокатов",
  "Услуги автомоек",
  "Услуги гостиниц / домов отдыха / коттеджей",
  "Услуги СТО",
  "Услуги по доставке",
  "Услуги по обучению",
  "Услуги по уборке",
  "Услуги кинотеатров",
  "Услуги спортивных залов",
  "Услуги фотосалонов",
  "Услуги караоке / клубов",
  "Услуги интернет-клубов",
  "Услуги по сдаче в аренду имущества",
  "Прочие услуги"
];


/* ============================================================
   DISTRICTS → UGNS
============================================================ */
const districtsData = [
  { code: "001", name: "Октябрьский район" },
  { code: "002", name: "Ленинский район" },
  { code: "003", name: "Свердловский район" },
  { code: "004", name: "Первомайский район" },

  { code: "034", name: "Ак-Талинский район" },
  { code: "035", name: "Ат-Башинский район" },
  { code: "036", name: "Кочкорский район" },
  { code: "037", name: "Жумгальский район" },
  { code: "038", name: "Нарынский район" },
  { code: "039", name: "Сузакский район" },
  { code: "040", name: "Ноокенский район" },
  { code: "041", name: "Ала-Букинский район" },
  { code: "042", name: "Токтогульский район" },
  { code: "043", name: "Аксыйский район" },
  { code: "044", name: "Тогуз-Тороузский район" },
  { code: "045", name: "Базар-Коргонский район" },
  { code: "047", name: "Чаткалский район" },
  { code: "048", name: "г. Джалал-Абад" },
  { code: "049", name: "г. Таш-Кумыр" },
  { code: "050", name: "г. Майлы-Суу" },
  { code: "052", name: "г. Кара-Куль" },

  { code: "007", name: "Иссык-Атинский район" },
  { code: "008", name: "Жайылский район" },
  { code: "009", name: "Аламудунский район" },
  { code: "010", name: "Кеминский район" },
  { code: "011", name: "Панфиловский район" },
  { code: "012", name: "Сокулукский район" },
  { code: "013", name: "Чуйский район" },
  { code: "014", name: "Иссык-Кульский район" },
  { code: "015", name: "Ак-Суйский район" },
  { code: "016", name: "Тонский район" },
  { code: "017", name: "Жети-Огузский район" },
  { code: "018", name: "Тюпский район" },
  { code: "019", name: "г. Каракол" },
  { code: "020", name: "Таласский район" },
  { code: "021", name: "Бакай-Атинский район" },
  { code: "022", name: "Кара-Буринский район" },
  { code: "023", name: "Манасский район" },
  { code: "024", name: "г. Талас" },

  { code: "025", name: "г. Чуй-Токмок" },
  { code: "026", name: "г. Нарын" },
  { code: "027", name: "г. Баткен" },
  { code: "028", name: "г. Бишкек" },
  { code: "029", name: "УККН Юг" },
  { code: "030", name: "Кадамжайский район" },
  { code: "031", name: "г. Кызыл-Кия" },
  { code: "032", name: "г. Ош" },
  { code: "033", name: "г. Сулюкта" },

  { code: "055", name: "Алайский район" },
  { code: "056", name: "Чон-Алайский район" },
  { code: "057", name: "Араванский район" },
  { code: "058", name: "Баткенский район" },
  { code: "059", name: "Кара-Сууйский район" },
  { code: "060", name: "Лейлекский район" },

  { code: "997", name: "УККН Юг (крупные налогоплательщики, юг)" },
  { code: "998", name: "СЭЗ Бишкек" },
  { code: "999", name: "УККН (крупные налогоплательщики)" }
];


/* ============================================================
   LANGUAGE SWITCH
============================================================ */
const langSelect = document.getElementById("langSelect");

if (langSelect) {
  const savedLang = localStorage.getItem("lang") || "ru";
  langSelect.value = savedLang;

  function applyTranslations(lang) {
    // Статические тексты
    document.querySelectorAll("[data-key]").forEach((el) => {
      if (["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName)) return;
      if (el.classList.contains("no-translate")) return;

      const key = el.getAttribute("data-key");
      const tr = window.translations?.[lang]?.[key];
      if (tr) el.textContent = tr;
    });

    // Плейсхолдеры
    document.querySelectorAll("[data-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-placeholder");
      const tr = window.translations?.[lang]?.[key];
      if (tr) el.placeholder = tr;
    });

    localStorage.setItem("lang", lang);
  }

  applyTranslations(savedLang);

  langSelect.addEventListener("change", () => {
    applyTranslations(langSelect.value);
  });
}


/* ============================================================
   AUTO-SAVE FIELDS
============================================================ */
const autoSaveFields = [
  "companyName", "companyBin", "companyHead", "manager",
  "phone", "email",
  "posModel",
  "comm_visa_dkb", "comm_bonus_dkb", "comm_visa_other",
  "comm_elcart_dkb", "comm_elcart_other",
  "comm_mc_dkb", "comm_mc_other",
  "discount_10",
  "district", "ugnsCode",
  "businessObjectType", "activityType",
  "legalAddress", "legalLat", "legalLon",
  "tradeAddress", "tradeLat", "tradeLon",
  "description"
];

autoSaveFields.forEach((id) => {
  const el = document.getElementById(id);
  if (!el) return;

  const saved = localStorage.getItem(id);
  if (saved !== null) el.value = saved;

  el.addEventListener("input", () => {
    localStorage.setItem(id, el.value);
  });
});


/* ============================================================
   DOMContentLoaded INITIALIZATION
============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  /* ---------- BUSINESS SELECTS ---------- */
  const bo = document.getElementById("businessObjectType");
  const at = document.getElementById("activityType");

  if (bo) {
    businessObjects.forEach((v) => {
      const opt = document.createElement("option");
      opt.value = v;
      opt.textContent = v;
      bo.appendChild(opt);
    });

    const savedBO = localStorage.getItem("businessObjectType");
    if (savedBO) bo.value = savedBO;
  }

  if (at) {
    activityTypes.forEach((v) => {
      const opt = document.createElement("option");
      opt.value = v;
      opt.textContent = v;
      at.appendChild(opt);
    });

    const savedAT = localStorage.getItem("activityType");
    if (savedAT) at.value = savedAT;
  }

  /* ---------- DISTRICTS / UGNS ---------- */
  const districtSelect = document.getElementById("district");
  const ugnsInput = document.getElementById("ugnsCode");

  if (districtSelect && ugnsInput) {
    // Заполняем список районов
    districtsData.forEach((d) => {
      const opt = document.createElement("option");
      opt.value = d.code;
      opt.textContent = d.name;
      districtSelect.appendChild(opt);
    });

    // Восстановление сохранённого значения
    const savedDistrict = localStorage.getItem("district");
    if (savedDistrict) {
      districtSelect.value = savedDistrict;
      ugnsInput.value = savedDistrict; // код УГНС совпадает с value
    }

    districtSelect.addEventListener("change", () => {
      const code = districtSelect.value;
      ugnsInput.value = code;
      localStorage.setItem("district", code);
      localStorage.setItem("ugnsCode", code);
    });
  }

  /* ---------- POS MODEL ---------- */
  const posModel = document.getElementById("posModel");
  if (posModel) {
    const savedPos = localStorage.getItem("posModel");
    if (savedPos) posModel.value = savedPos;

    posModel.addEventListener("change", () => {
      localStorage.setItem("posModel", posModel.value);
    });
  }

  /* ---------- LEAFLET MAPS ---------- */
  initMap("legalMap", "legalAddress", "legalLat", "legalLon");
  initMap("tradeMap", "tradeAddress", "tradeLat", "tradeLon");
});


/* ============================================================
   LEAFLET MAP + REVERSE GEOCODING
============================================================ */
function initMap(mapId, addressInputId, latInputId, lonInputId) {
  const mapDiv = document.getElementById(mapId);
  if (!mapDiv || typeof L === "undefined") return;

  const defaultLat = 42.8746;
  const defaultLon = 74.5698;

  const savedLat = parseFloat(localStorage.getItem(latInputId) || defaultLat);
  const savedLon = parseFloat(localStorage.getItem(lonInputId) || defaultLon);

  const map = L.map(mapId).setView([savedLat, savedLon], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap"
  }).addTo(map);

  const marker = L.marker([savedLat, savedLon], { draggable: true }).addTo(map);

  function updateFields(lat, lon, doReverse = true) {
    const latEl = document.getElementById(latInputId);
    const lonEl = document.getElementById(lonInputId);
    const addrEl = document.getElementById(addressInputId);

    if (latEl) {
      latEl.value = lat.toFixed(6);
      localStorage.setItem(latInputId, lat.toFixed(6));
    }
    if (lonEl) {
      lonEl.value = lon.toFixed(6);
      localStorage.setItem(lonInputId, lon.toFixed(6));
    }

    if (doReverse && addrEl) {
      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=ru`
      )
        .then((r) => r.json())
        .then((data) => {
          if (data && data.display_name) {
            addrEl.value = data.display_name;
            localStorage.setItem(addressInputId, data.display_name);
          }
        })
        .catch(() => {});
    }
  }

  // начальное обновление
  updateFields(savedLat, savedLon);

  marker.on("dragend", (e) => {
    const pos = e.target.getLatLng();
    updateFields(pos.lat, pos.lng);
  });

  map.on("click", (e) => {
    marker.setLatLng(e.latlng);
    updateFields(e.latlng.lat, e.latlng.lng);
  });
}


/* ============================================================
   PDF EXPORT — FILL TEMPLATE
============================================================ */
function fillPdfTemplate() {
  const pairs = [
    ["companyName", "pdf_companyName"],
    ["companyBin", "pdf_companyBin"],
    ["companyHead", "pdf_companyHead"],
    ["manager", "pdf_manager"],
    ["phone", "pdf_phone"],
    ["email", "pdf_email"],
    ["legalAddress", "pdf_legalAddress"],
    ["tradeAddress", "pdf_tradeAddress"],
    ["businessObjectType", "pdf_businessObjectType"],
    ["activityType", "pdf_activityType"],
    ["posModel", "pdf_posModel"],
    ["description", "pdf_description"],
    ["comm_visa_dkb", "pdf_comm_visa_dkb"],
    ["comm_bonus_dkb", "pdf_comm_bonus_dkb"],
    ["comm_visa_other", "pdf_comm_visa_other"],
    ["comm_elcart_dkb", "pdf_comm_elcart_dkb"],
    ["comm_elcart_other", "pdf_comm_elcart_other"],
    ["comm_mc_dkb", "pdf_comm_mc_dkb"],
    ["comm_mc_other", "pdf_comm_mc_other"],
    ["discount_10", "pdf_discount_10"]
  ];

  pairs.forEach(([srcId, dstId]) => {
    const srcEl = document.getElementById(srcId);
    const dstEl = document.getElementById(dstId);
    if (!dstEl) return;

    dstEl.textContent = srcEl ? (srcEl.value || "") : "";
  });

  // Район + УГНС
  const districtSelect = document.getElementById("district");
  const ugnsInput = document.getElementById("ugnsCode");
  const pdfDistrict = document.getElementById("pdf_district_ugns");

  if (pdfDistrict && districtSelect && ugnsInput) {
    const code = ugnsInput.value || "";
    const opt = districtSelect.options[districtSelect.selectedIndex];
    const name = opt ? opt.text : "";
    if (name && code) {
      pdfDistrict.textContent = `${name} (код ${code})`;
    } else {
      pdfDistrict.textContent = name || code || "";
    }
  }
}

const savePdfBtn = document.getElementById("savePdf");
if (savePdfBtn) {
  savePdfBtn.addEventListener("click", () => {
    fillPdfTemplate();
    const pdfDoc = document.getElementById("pdfDocument");
    if (!pdfDoc || typeof html2pdf === "undefined") return;

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
}


/* ============================================================
   SIMPLE SPELLCHECK MOCK
============================================================ */
const spellPanel = document.getElementById("spellcheckPanel");

function fakeSpellCheck() {
  if (!spellPanel) return;
  spellPanel.innerHTML = "";

  const ids = ["companyName", "companyHead", "description"];

  ids.forEach((id) => {
    const el = document.getElementById(id);
    if (!el || !el.value) return;

    const words = el.value.split(/\s+/);

    words.forEach((w) => {
      if (w.length > 6 && Math.random() < 0.03) {
        const div = document.createElement("div");
        div.textContent = `Возможная ошибка: «${w}»`;
        spellPanel.appendChild(div);
      }
    });
  });
}

setInterval(fakeSpellCheck, 2500);
