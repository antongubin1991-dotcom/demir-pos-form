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
   SLK ENDPOINT
============================================================ */
const SLK_ENDPOINT = "";

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
  "Услуги сетей быстрого питания",
  "Услуги салонов красоты",
  "Услуги нотариусов / адвокатов",
  "Услуги автомоек",
  "Услуги гостиниц / коттеджей",
  "Услуги СТО",
  "Услуги по доставке",
  "Услуги по обучению",
  "Услуги по уборке",
  "Услуги кинотеатров",
  "Услуги спортивных залов",
  "Услуги фотосалонов",
  "Услуги караоке / клубов",
  "Услуги интернет-клубов",
  "Услуги по аренде",
  "Прочие услуги"
];

/* ============================================================
   RESPONSIBLE BRANCHES
============================================================ */
const responsibleBranches = [
  "СК Авангард", "СК Ала-Бука", "СК Асанбай", "СК Азия Молл",
  "СК Бета-2", "СК Бишкек-Парк", "СК Глобус", "СК Глобус-2",
  "СК Глобус-3", "СК Глобус-4", "СК Гранд Комфорт", "СК Джал",
  "СК Дордой-Плаза", "СК Эркиндик", "СК Карвен", "СК Имарат",
  "СК Фрунзе-Ош", "СК Чолпон-Ата", "СК Чуй, 243",
  "Ф-л «ДКИБ-Бейшеналиева»", "Ф-л «ДКИБ-Главный»",
  "Ф-л «ДКИБ-Жалал-Абад»", "Ф-л «ДКИБ-Каракол»",
  "Ф-л «ДКИБ-Кызыл-Кия»", "Ф-л «ДКИБ-М.Горький»",
  "Ф-л «ДКИБ-Манас»", "Ф-л «ДКИБ-Нарын»",
  "Ф-л «ДКИБ-Ош»", "Ф-л «ДКИБ-Ош-Датка»",
  "Ф-л «ДКИБ-Талас»", "Ф-л «ДКИБ-Центр»",
  "Ф-л «ДКИБ-ЦУМ»", "Ф-л «ДКИБ-Южный»"
];

/* ============================================================
   INIT RESPONSIBLE BRANCH SELECT
============================================================ */
function initResponsibleBranchesSelect() {
  const select = document.getElementById("responsibleBranches");
  if (!select) return;

  select.innerHTML = "";
  responsibleBranches.forEach(branch => {
    const opt = document.createElement("option");
    opt.value = branch;
    opt.textContent = branch;
    select.appendChild(opt);
  });
}

/* ============================================================
   DISTRICTS DATA
============================================================ */
const districtsData = [
  { code: "001", name: "Октябрьский район" },
  { code: "002", name: "Ленинский район" },
  { code: "003", name: "Свердловский район" },
  { code: "004", name: "Первомайский район" },
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
  { code: "028", name: "г. Бишкек" },
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
    document.querySelectorAll("[data-key]").forEach((el) => {
      if (["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName)) return;
      const key = el.getAttribute("data-key");
      const tr = window.translations?.[lang]?.[key];
      if (tr) el.textContent = tr;
    });

    localStorage.setItem("lang", lang);
  }

  applyTranslations(savedLang);

  langSelect.addEventListener("change", () => {
    applyTranslations(langSelect.value);
  });
}

/* ============================================================
   AUTO SAVE
============================================================ */
const autoSaveFields = [
  "companyName", "companyBin", "companyHead", "companyHeadInn",
  "manager", "phone", "email", "posModel",
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

autoSaveFields.forEach(id => {
  const el = document.getElementById(id);
  if (!el) return;

  const saved = localStorage.getItem(id);
  if (saved !== null) el.value = saved;

  el.addEventListener("input", () => {
    localStorage.setItem(id, el.value);
  });
});

/* ============================================================
   AUTODETECT DISTRICT
============================================================ */
function updateDistrictFromAddress(addressText) {
  if (!addressText) return;
  const districtSelect = document.getElementById("district");
  const ugns = document.getElementById("ugnsCode");
  if (!districtSelect || !ugns) return;

  const text = addressText.toLowerCase();
  const match = districtsData.find(d => text.includes(d.name.toLowerCase()));
  if (match) {
    districtSelect.value = match.code;
    ugns.value = match.code;
    localStorage.setItem("district", match.code);
    localStorage.setItem("ugnsCode", match.code);
  }
}

/* ============================================================
   DOM READY
============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  initResponsibleBranchesSelect();

  const bo = document.getElementById("businessObjectType");
  if (bo) {
    businessObjects.forEach(v => {
      const opt = document.createElement("option");
      opt.value = v;
      opt.textContent = v;
      bo.appendChild(opt);
    });
  }

  const at = document.getElementById("activityType");
  if (at) {
    activityTypes.forEach(v => {
      const opt = document.createElement("option");
      opt.value = v;
      opt.textContent = v;
      at.appendChild(opt);
    });
  }

  const districtSelect = document.getElementById("district");
  if (districtSelect) {
    districtsData.forEach(d => {
      const opt = document.createElement("option");
      opt.value = d.code;
      opt.textContent = d.name;
      districtSelect.appendChild(opt);
    });
  }

  initMap("legalMap", "legalAddress", "legalLat", "legalLon");
  initMap("tradeMap", "tradeAddress", "tradeLat", "tradeLon");
});

/* ============================================================
   LEAFLET MAP HANDLER
============================================================ */
function initMap(mapId, addressId, latId, lonId) {
  const mapDiv = document.getElementById(mapId);
  if (!mapDiv || typeof L === "undefined") return;

  const defLat = 42.8746, defLon = 74.5698;
  const savedLat = parseFloat(localStorage.getItem(latId) || defLat);
  const savedLon = parseFloat(localStorage.getItem(lonId) || defLon);

  const map = L.map(mapId).setView([savedLat, savedLon], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19
  }).addTo(map);

  const marker = L.marker([savedLat, savedLon], { draggable: true }).addTo(map);

  function updateFields(lat, lon, reverse = true) {
    document.getElementById(latId).value = lat.toFixed(6);
    document.getElementById(lonId).value = lon.toFixed(6);
    localStorage.setItem(latId, lat.toFixed(6));
    localStorage.setItem(lonId, lon.toFixed(6));

    if (reverse) {
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=ru`)
        .then(r => r.json())
        .then(data => {
          if (data.display_name) {
            document.getElementById(addressId).value = data.display_name;
            localStorage.setItem(addressId, data.display_name);

            if (addressId === "tradeAddress") {
              updateDistrictFromAddress(data.display_name);
            }
          }
        });
    }
  }

  updateFields(savedLat, savedLon, true);

  marker.on("dragend", e => {
    const pos = e.target.getLatLng();
    updateFields(pos.lat, pos.lng);
  });

  map.on("click", e => {
    marker.setLatLng(e.latlng);
    updateFields(e.latlng.lat, e.latlng.lng);
  });
}

/* ============================================================
   JSON HELPERS
============================================================ */
function val(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : "";
}

function collectFormData() {
  return {
    company: {
      name: val("companyName"),
      bin: val("companyBin"),
      headFio: val("companyHead"),
      headInn: val("companyHeadInn")
    },
    contacts: {
      phone: val("phone"),
      email: val("email")
    },
    pos: {
      model: val("posModel"),
      commissions: {
        visaDkb: val("comm_visa_dkb"),
        bonusDkb: val("comm_bonus_dkb"),
        visaOther: val("comm_visa_other"),
        elcartDkb: val("comm_elcart_dkb"),
        elcartOther: val("comm_elcart_other"),
        mcDkb: val("comm_mc_dkb"),
        mcOther: val("comm_mc_other")
      },
      discounts: {
        discount10: val("discount_10")
      }
    },
    region: {
      districtCode: val("district"),
      ugnsCode: val("ugnsCode")
    },
    business: {
      objectType: val("businessObjectType"),
      activityType: val("activityType")
    },
    addresses: {
      legal: {
        address: val("legalAddress"),
        lat: val("legalLat"),
        lon: val("legalLon")
      },
      trade: {
        address: val("tradeAddress"),
        lat: val("tradeLat"),
        lon: val("tradeLon")
      }
    },
    comment: val("description"),
    manager: val("manager"),
    meta: {
      lang: localStorage.getItem("lang") || "ru",
      theme: localStorage.getItem("theme") || "light",
      createdAt: new Date().toISOString()
    }
  };
}

/* ============================================================
   SLK SENDER
============================================================ */
async function sendToSLK(payload) {
  if (!SLK_ENDPOINT) {
    console.log("JSON для SLK:", JSON.stringify(payload, null, 2));
    return;
  }

  try {
    await fetch(SLK_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  } catch (e) {
    console.error("SLK ERROR:", e);
  }
}

/* ============================================================
   PDF GENERATOR
============================================================ */
function fillPdfTemplate() {
  const map = [
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

  map.forEach(([src, dst]) => {
    const s = document.getElementById(src);
    const d = document.getElementById(dst);
    if (d) d.textContent = s ? s.value : "";
  });

  const pdfDate = document.getElementById("pdf_date");
  if (pdfDate) {
    const d = new Date();
    pdfDate.textContent =
      `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}.${d.getFullYear()} г.`;
  }
}

const savePdfBtn = document.getElementById("savePdf");
if (savePdfBtn) {
  savePdfBtn.addEventListener("click", async () => {
    const data = collectFormData();
    await sendToSLK(data);
    fillPdfTemplate();

    const pdfDoc = document.getElementById("pdfDocument");
    html2pdf().set({
      margin: 10,
      filename: "Demir_POS_Form.pdf",
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
    }).from(pdfDoc).save();
  });
}

/* ============================================================
   SIMPLE SPELLCHECK
============================================================ */
const spellPanel = document.getElementById("spellcheckPanel");

function fakeSpellCheck() {
  if (!spellPanel) return;
  spellPanel.innerHTML = "";

  ["companyName", "companyHead", "description"].forEach(id => {
    const el = document.getElementById(id);
    if (!el || !el.value) return;

    el.value.split(/\s+/).forEach(w => {
      if (w.length > 6 && Math.random() < 0.03) {
        const div = document.createElement("div");
        div.textContent = `Возможная ошибка: ${w}`;
        spellPanel.appendChild(div);
      }
    });
  });
}

setInterval(fakeSpellCheck, 2500);
