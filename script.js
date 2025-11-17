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
   SLK ENDPOINT (URL ДЛЯ ОТПРАВКИ JSON)
============================================================ */
const SLK_ENDPOINT = ""; // например: "https://slk.goodoo.kg/api/demir-pos-form"

/* ============================================================
   SLK JSON HELPERS
============================================================ */
function getFieldValue(id) {
  const el = document.getElementById(id);
  return el ? (el.value || "").trim() : "";
}

function collectFormData() {
  return {
    company: {
      name:        getFieldValue("companyName"),
      bin:         getFieldValue("companyBin"),
      head:        getFieldValue("companyHead"),
      manager:     getFieldValue("manager"),
      description: getFieldValue("description")
    },
    contacts: {
      phone: getFieldValue("phone"),
      email: getFieldValue("email")
    },
    pos: {
      model: getFieldValue("posModel"),
      commissions: {
        visa_dkb:      getFieldValue("comm_visa_dkb"),
        bonus_dkb:     getFieldValue("comm_bonus_dkb"),
        visa_other:    getFieldValue("comm_visa_other"),
        elcart_dkb:    getFieldValue("comm_elcart_dkb"),
        elcart_other:  getFieldValue("comm_elcart_other"),
        mc_dkb:        getFieldValue("comm_mc_dkb"),
        mc_other:      getFieldValue("comm_mc_other")
      },
      discount_10: getFieldValue("discount_10")
    },
    region: {
      district:      getFieldValue("district"),
      ugnsCode:      getFieldValue("ugnsCode"),
      legalAddress:  getFieldValue("legalAddress"),
      legalLat:      getFieldValue("legalLat"),
      legalLon:      getFieldValue("legalLon"),
      tradeAddress:  getFieldValue("tradeAddress"),
      tradeLat:      getFieldValue("tradeLat"),
      tradeLon:      getFieldValue("tradeLon")
    },
    business: {
      objectType:   getFieldValue("businessObjectType"),
      activityType: getFieldValue("activityType")
    },
    meta: {
      createdAt: new Date().toISOString(),
      userAgent: navigator.userAgent
    },
    // чтобы при желании можно было слать подпись в SLK
    signature: getFieldValue("signatureData")
  };
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
   RESPONSIBLE BRANCHES
============================================================ */
const responsibleBranches = [
  "СК Авангард",
  "СК Ала-Бука",
  "СК Асанбай",
  "СК Азия Молл",
  "СК Бета-2",
  "СК Бишкек-Парк",
  "СК Глобус",
  "СК Глобус-2",
  "СК Глобус-3",
  "СК Глобус-4",
  "СК Гранд Комфорт",
  "СК Джал",
  "СК Дордой-Плаза",
  "СК Эркиндик",
  "СК Карвен",
  "СК Имарат",
  "СК Фрунзе-Ош",
  "СК Чолпон-Ата",
  "СК Чуй, 243",
  "Ф-л «ДКИБ-Бейшеналиева»",
  "Ф-л «ДКИБ-Главный»",
  "Ф-л «ДКИБ-Жалал-Абад»",
  "Ф-л «ДКИБ-Каракол»",
  "Ф-л «ДКИБ-Кызыл-Кия»",
  "Ф-л «ДКИБ-М.Горький»",
  "Ф-л «ДКИБ-Манас»",
  "Ф-л «ДКИБ-Нарын»",
  "Ф-л «ДКИБ-Ош»",
  "Ф-л «ДКИБ-Ош-Датка»",
  "Ф-л «ДКИБ-Талас»",
  "Ф-л «ДКИБ-Центр»",
  "Ф-л «ДКИБ-ЦУМ»",
  "Ф-л «ДКИБ-Южный»"
];

/* ============================================================
   INIT RESPONSIBLE BRANCH DROPDOWN
============================================================ */
function initResponsibleBranchesSelect() {
  const select = document.getElementById("responsibleBranches");
  if (!select) return;

  select.innerHTML = "";

  responsibleBranches.forEach((branch) => {
    const opt = document.createElement("option");
    opt.value = branch;
    opt.textContent = branch;
    select.appendChild(opt);
  });
}

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
    document.querySelectorAll("[data-key]").forEach((el) => {
      if (["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName)) return;
      if (el.classList.contains("no-translate")) return;

      const key = el.getAttribute("data-key");
      const tr = window.translations?.[lang]?.[key];
      if (tr) el.textContent = tr;
    });

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
  "companyName", "companyBin", "companyHead", "companyHeadInn", "manager",
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
   ОПРЕДЕЛЕНИЕ РАЙОНА/УГНС ПО АДРЕСУ ТОРГОВОЙ ТОЧКИ
============================================================ */
function updateDistrictFromAddress(addressText) {
  if (!addressText) return;

  const districtSelect = document.getElementById("district");
  const ugnsInput = document.getElementById("ugnsCode");
  if (!districtSelect || !ugnsInput) return;

  const text = addressText.toLowerCase();

  const match = districtsData.find((d) =>
    text.includes(d.name.toLowerCase())
  );

  if (match) {
    districtSelect.value = match.code;
    ugnsInput.value = match.code;
    localStorage.setItem("district", match.code);
    localStorage.setItem("ugnsCode", match.code);
  }
}

/* ============================================================
   DOMContentLoaded INITIALIZATION
============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  // Ответственный филиал
  initResponsibleBranchesSelect();

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

  /* ---------- DISTRICTS / UGNS (заполнение списка) ---------- */
  const districtSelect = document.getElementById("district");
  const ugnsInput = document.getElementById("ugnsCode");

  if (districtSelect && ugnsInput) {
    districtsData.forEach((d) => {
      const opt = document.createElement("option");
      opt.value = d.code;
      opt.textContent = d.name;
      districtSelect.appendChild(opt);
    });

    const savedDistrict = localStorage.getItem("district");
    const savedUgns = localStorage.getItem("ugnsCode");

    if (savedDistrict) {
      districtSelect.value = savedDistrict;
      ugnsInput.value = savedUgns || savedDistrict;
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

  /* ---------- TRADE ADDRESS → АВТО РАЙОН/УГНС ---------- */
  const tradeAddress = document.getElementById("tradeAddress");
  if (tradeAddress) {
    tradeAddress.addEventListener("blur", () => {
      updateDistrictFromAddress(tradeAddress.value);
    });
    tradeAddress.addEventListener("change", () => {
      updateDistrictFromAddress(tradeAddress.value);
    });

    if (tradeAddress.value) {
      updateDistrictFromAddress(tradeAddress.value);
    }
  }

  /* ---------- LEAFLET MAPS ---------- */
  initMap("legalMap", "legalAddress", "legalLat", "legalLon");
  initMap("tradeMap", "tradeAddress", "tradeLat", "tradeLon");

  // 🔹 ИНИЦИАЛИЗАЦИЯ ПОДПИСИ
  initSignaturePad();
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

            if (addressInputId === "tradeAddress") {
              updateDistrictFromAddress(data.display_name);
            }
          }
        })
        .catch(() => {});
    }
  }

  // начальное состояние
  updateFields(savedLat, savedLon, true);

  marker.on("dragend", (e) => {
    const pos = e.target.getLatLng();
    updateFields(pos.lat, pos.lng, true);
  });

  map.on("click", (e) => {
    marker.setLatLng(e.latlng);
    updateFields(e.latlng.lat, e.latlng.lng, true);
  });
}
/* ============================================================
   SIGNATURE PAD
============================================================ */
function initSignaturePad() {
  var canvas = document.getElementById("signaturePad");
  var clearBtn = document.getElementById("signatureClear");
  var hiddenInput = document.getElementById("signatureData");

  if (!canvas || !canvas.getContext) return;

  var ctx = canvas.getContext("2d");
  var drawing = false;

  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.strokeStyle = "#000";

  function getPos(e) {
    var rect = canvas.getBoundingClientRect();
    var clientX, clientY;

    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    // Масштаб: внутренний размер канваса vs CSS-размер
    var scaleX = canvas.width / rect.width;
    var scaleY = canvas.height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  }

  function startDraw(e) {
    e.preventDefault();
    drawing = true;
    var pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  }

  function moveDraw(e) {
    if (!drawing) return;
    e.preventDefault();
    var pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  }

  function endDraw(e) {
    if (!drawing) return;
    e.preventDefault();
    drawing = false;
    saveSignature();
  }

  function saveSignature() {
    if (!hiddenInput) return;

    var dataUrl = canvas.toDataURL("image/png");
    hiddenInput.value = dataUrl;

    var pdfImg = document.getElementById("pdf_signature");
    if (pdfImg && dataUrl) {
      pdfImg.src = dataUrl;
    }
  }

  // Мышь (ПК)
  canvas.addEventListener("mousedown", startDraw);
  canvas.addEventListener("mousemove", moveDraw);
  window.addEventListener("mouseup", endDraw);

  // Тач (телефон / планшет)
  canvas.addEventListener("touchstart", startDraw, { passive: false });
  canvas.addEventListener("touchmove", moveDraw, { passive: false });
  canvas.addEventListener("touchend", endDraw, { passive: false });

  // Очистка подписи
  if (clearBtn) {
    clearBtn.addEventListener("click", function () {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (hiddenInput) hiddenInput.value = "";
      var pdfImg = document.getElementById("pdf_signature");
      if (pdfImg) {
        pdfImg.removeAttribute("src");
      }
    });
  }
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

  // Дата заполнения
  const pdfDate = document.getElementById("pdf_date");
  if (pdfDate) {
    const d = new Date();
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    pdfDate.textContent = `${dd}.${mm}.${yyyy} г.`;
  }
}

/* ============================================================
   PDF EXPORT — GENERATE + SLK JSON
============================================================ */
const savePdfBtn = document.getElementById("savePdf");
if (savePdfBtn) {
  savePdfBtn.addEventListener("click", async () => {
    // 1. Собираем JSON (только нужные строки для SLK)
    const formData = collectFormData();

    // 2. Подготовим подпись для PDF (если есть)
    const sigDataEl = document.getElementById("signatureData");
    const sigData = sigDataEl ? sigDataEl.value : "";
    const pdfSigImg = document.getElementById("pdf_signature");
    const sigBlock = document.querySelector(".pdf-signature-block");

    if (sigBlock) {
      if (sigData && pdfSigImg) {
        // есть подпись -> показываем блок и подставляем картинку
        sigBlock.style.display = "block";
        pdfSigImg.src = sigData;
      } else {
        // нет подписи -> полностью прячем блок, чтобы html2canvas не пытался отрисовать "битую" картинку
        sigBlock.style.display = "none";
        if (pdfSigImg) pdfSigImg.removeAttribute("src");
      }
    }

    // 3. Отправляем в SLK (или просто логируем)
    await sendToSLK(formData);

    // 4. Заполняем PDF-шаблон (все pdf_* поля)
    fillPdfTemplate();

    // 5. Генерация PDF через html2pdf
    const pdfDoc = document.getElementById("pdfDocument");
    if (!pdfDoc) {
      alert("PDF-шаблон не найден (pdfDocument).");
      return;
    }
    if (typeof html2pdf === "undefined") {
      alert("Модуль html2pdf не загружен. Проверьте подключение html2pdf.bundle.min.js.");
      return;
    }

    // Временно показываем блок для корректного рендера
    const prevDisplay = pdfDoc.style.display;
    pdfDoc.style.display = "block";

    try {
      await html2pdf()
        .set({
          margin: 10,
          filename: "Demir_POS_Form.pdf",
          html2canvas: {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            logging: false, // можно включить true для отладки
            backgroundColor: "#ffffff"
          },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
        })
        .from(pdfDoc)
        .save();
    } catch (err) {
      console.error("Ошибка html2pdf/html2canvas:", err);
      alert("Ошибка при формировании PDF. Подробности смотри в консоли.");
    } finally {
      pdfDoc.style.display = prevDisplay || "none";
      // после генерации можно вернуть блок подписи назад
      if (sigBlock) sigBlock.style.display = "block";
    }
  });
}

/* Отправка в SLK */
async function sendToSLK(payload) {
  try {
    // Если эндпоинт не настроен — просто лог
    if (!SLK_ENDPOINT) {
      console.log("JSON для SLK (только 1–22 строки):", payload);
      return;
    }

    const resp = await fetch(SLK_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!resp.ok) {
      const text = await resp.text();
      console.error("Ошибка отправки в SLK:", resp.status, text);
      alert("Ошибка отправки данных в SLK. Подробности смотри в консоли.");
    }
  } catch (e) {
    console.error("Сетевая ошибка при отправке в SLK:", e);
    alert("Сетевая ошибка при отправке данных в SLK. Подробности смотри в консоли.");
  }
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
