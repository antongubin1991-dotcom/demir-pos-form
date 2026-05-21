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
   POS MODELS DICTIONARY
   TODO (банк): подтвердить коды моделей POS, реальные модели ККМ,
   которые идут с каждым POS, и какие POS вообще поддерживают ККМ.
============================================================ */
const posModels = {
  "Beko":     { code: 1, kkmModel: "BEKO 300",      supportsKKM: true  },
  "SoftPOS":  { code: 2, kkmModel: "",              supportsKKM: false },
  "Ingenico": { code: 3, kkmModel: "Ingenico iWE",  supportsKKM: true  },
  "Aisino":   { code: 4, kkmModel: "Aisino A90",    supportsKKM: true  },
  "Kozen":    { code: 5, kkmModel: "Kozen P12",     supportsKKM: true  }
};

/* ============================================================
   SLK ENDPOINT
   Пока не используется — отправка отключена (см. план Фазы 8)
============================================================ */
const SLK_ENDPOINT = "";

function getFieldValue(id) {
  const el = document.getElementById(id);
  return el ? (el.value || "").trim() : "";
}

function collectFormDataForSLK() {
  // Заготовка для будущей интеграции с банковским сервером.
  // Сейчас просто собирает данные — отправка не делается.
  return {
    user: {
      username: getFieldValue("lkLogin"),
      password: getFieldValue("lkPassword")
    },
    taxpayer: {
      name: getFieldValue("companyName"),
      identificationNumber: getFieldValue("companyBin"),
      legalAddress: getFieldValue("legalAddress"),
      directorFullName: getFieldValue("companyHead"),
      directorPhoneNumber: getFieldValue("phone"),
      email: getFieldValue("email")
    },
    partnerCode: getFieldValue("responsibleBranches"),
    fiscalDevice: {
      model: getFieldValue("posModel"),
      contractNumber: getFieldValue("contractNumber"),
      contractDate: getFieldValue("contractDate"),
      businessObjectType:
        businessObjectTypeCodes[getFieldValue("businessObjectType")] || 0,
      businessActivityType:
        activityTypeCodes[getFieldValue("activityType")] || 0,
      taxAuthority: getFieldValue("ugnsCode") || 999,
      vatPayer: getFieldValue("vatStatus") === "vat",
      placeName: getFieldValue("tradeAddress"),
      placeType: getFieldValue("businessObjectType"),
      addressPostalCode: getFieldValue("postalCode") || "720000",
      addressArea: getFieldValue("district"),
      addressCity: "Бишкек",
      addressStreet: getFieldValue("tradeAddress"),
      addressBuilding: "",
      addressLatitude: getFieldValue("tradeLat"),
      addressLongitude: getFieldValue("tradeLon"),
      taxationTypes: [0],
      paymentObjects: [0]
    },
    // Блок ККМ заполняется только если выбрана опция "С ККМ"
    kkm: getFieldValue("terminalTypeRadio") === "withKKM" ? {
      objectName: getFieldValue("objectName"),
      vatStatus: getFieldValue("vatStatus"),
      taxRates: getFieldValue("taxRates"),
      paymentSubject: getFieldValue("paymentSubject"),
      serialNumber: getFieldValue("kkmSerialNumber"),
      version: getFieldValue("kkmVersion"),
      model: getFieldValue("kkmModel"),
      rnm: getFieldValue("kkmRnm"),
      fn: getFieldValue("kkmFn"),
      reason: getFieldValue("kkmReason")
    } : null
  };
}

/* ============================================================
   CBS (поиск по ИНН)
============================================================ */
const CBS_ENDPOINT = "";

function fillFormFromCbs(data) {
  if (!data) return;
  const mapping = {
    companyName: "companyName",
    companyBin: "companyBin",
    companyHead: "companyHead",
    companyHeadInn: "companyHeadInn",
    email: "email",
    phone: "phone",
    legalAddress: "legalAddress",
    tradeAddress: "tradeAddress"
  };
  Object.entries(mapping).forEach(([k, id]) => {
    if (data[k]) {
      const el = document.getElementById(id);
      if (el && !el.value) el.value = data[k];
    }
  });
}

async function fetchCbsByInn(inn) {
  if (!CBS_ENDPOINT) {
    console.log("CBS_ENDPOINT не настроен, пропуск. ИНН:", inn);
    return null;
  }
  try {
    const res = await fetch(CBS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inn: inn.trim() })
    });
    if (!res.ok) {
      console.error("Ошибка ответа CBS:", res.status);
      alert("Не удалось получить данные клиента из CBS.");
      return null;
    }
    return await res.json();
  } catch (e) {
    console.error("Сетевая ошибка CBS:", e);
    alert("Ошибка подключения к CBS.");
    return null;
  }
}

function initCbsIntegration() {
  const statusSelect = document.getElementById("clientStatus");
  const innInput = document.getElementById("companyBin");
  if (!statusSelect || !innInput) return;

  async function tryFetchIfExisting() {
    if (statusSelect.value !== "existing") return;
    const inn = (innInput.value || "").trim();
    if (inn.length < 8) return;
    const data = await fetchCbsByInn(inn);
    if (data) fillFormFromCbs(data);
  }

  statusSelect.addEventListener("change", () => {
    if (statusSelect.value === "existing") tryFetchIfExisting();
  });
  innInput.addEventListener("blur", tryFetchIfExisting);
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

const businessObjectTypeCodes = {};
businessObjects.forEach((name, i) => { businessObjectTypeCodes[name] = i + 1; });

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

const activityTypeCodes = {};
activityTypes.forEach((name, i) => { activityTypeCodes[name] = i + 1; });

/* ============================================================
   RESPONSIBLE BRANCHES
============================================================ */
const responsibleBranches = [
  "СК Авангард", "СК Ала-Бука", "СК Асанбай", "СК Азия Молл", "СК Бета-2",
  "СК Бишкек-Парк", "СК Глобус", "СК Глобус-2", "СК Глобус-3", "СК Глобус-4",
  "СК Гранд Комфорт", "СК Джал", "СК Дордой-Плаза", "СК Эркиндик", "СК Карвен",
  "СК Имарат", "СК Фрунзе-Ош", "СК Чолпон-Ата", "СК Чуй, 243",
  "Ф-л «ДКИБ-Бейшеналиева»", "Ф-л «ДКИБ-Главный»", "Ф-л «ДКИБ-Жалал-Абад»",
  "Ф-л «ДКИБ-Каракол»", "Ф-л «ДКИБ-Кызыл-Кия»", "Ф-л «ДКИБ-М.Горький»",
  "Ф-л «ДКИБ-Манас»", "Ф-л «ДКИБ-Нарын»", "Ф-л «ДКИБ-Ош»", "Ф-л «ДКИБ-Ош-Датка»",
  "Ф-л «ДКИБ-Талас»", "Ф-л «ДКИБ-Центр»", "Ф-л «ДКИБ-ЦУМ»", "Ф-л «ДКИБ-Южный»"
];

function initResponsibleBranchesSelect() {
  const select = document.getElementById("responsibleBranches");
  if (!select) return;
  select.innerHTML = "";

  // ИЗМЕНЕНО: добавлен placeholder "— выбрать филиал —", чтобы валидация не считала
  // первый филиал по умолчанию заполненным
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "— выбрать филиал —";
  select.appendChild(placeholder);

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

if (langSelect) {
  const savedLang = localStorage.getItem("lang") || "ru";
  langSelect.value = savedLang;
  applyTranslations(savedLang);

  langSelect.addEventListener("change", () => {
    applyTranslations(langSelect.value);
  });
}

/* ============================================================
   AUTO-SAVE FIELDS
   ВАЖНО: lkPassword УБРАН — пароль не должен жить в localStorage.
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
  "lkLogin",            // только логин, без пароля
  "description",
  "clientStatus",
  // ККМ-поля
  "objectName", "vatStatus", "taxRates", "paymentSubject",
  "kkmSerialNumber", "kkmVersion", "kkmModel", "kkmRnm", "kkmFn", "kkmReason",
  "postalCode"
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
   KKM TOGGLE — Фаза 1, ядро
   - "С ККМ"   → body.classList.add('kkm-active'),    показ .kkm-only
   - "Без ККМ" → body.classList.remove('kkm-active'), скрытие .kkm-only
   Значения полей в .kkm-only остаются в localStorage даже при переключении,
   чтобы случайный клик не стёр введённые данные.
============================================================ */
function applyKkmState(value) {
  if (value === "withKKM") {
    body.classList.add("kkm-active");
  } else {
    body.classList.remove("kkm-active");
  }
}

function initKkmToggle() {
  const radios = document.querySelectorAll('input[name="terminalType"]');
  if (!radios.length) return;

  // Восстановление из localStorage
  const saved = localStorage.getItem("terminalType");
  if (saved) {
    radios.forEach((r) => {
      if (r.value === saved) r.checked = true;
    });
    applyKkmState(saved);
  }

  // Слушатели на radio
  radios.forEach((r) => {
    r.addEventListener("change", () => {
      if (r.checked) {
        localStorage.setItem("terminalType", r.value);
        applyKkmState(r.value);
      }
    });
  });
}

/* ============================================================
   POS → KKM MODEL AUTO-FILL
   При выборе модели POS автоматически проставляет модель ККМ
   в read-only поле kkmModel.
============================================================ */
function initPosModelLinkage() {
  const posSelect = document.getElementById("posModel");
  const kkmModelInput = document.getElementById("kkmModel");
  if (!posSelect) return;

  function applyKkmModelFromPos() {
    const pos = posSelect.value;
    const info = posModels[pos];

    if (!kkmModelInput) return;

    if (info && info.supportsKKM) {
      kkmModelInput.value = info.kkmModel || "";
      kkmModelInput.placeholder = "";
    } else if (info && !info.supportsKKM) {
      kkmModelInput.value = "";
      kkmModelInput.placeholder = "Эта модель POS не поддерживает ККМ";
    } else {
      kkmModelInput.value = "";
      kkmModelInput.placeholder = "заполнится при выборе POS";
    }

    // Сохраняем
    localStorage.setItem("kkmModel", kkmModelInput.value);
  }

  posSelect.addEventListener("change", applyKkmModelFromPos);
  applyKkmModelFromPos();
}

/* ============================================================
   DISTRICT BY ADDRESS
============================================================ */
function updateDistrictFromAddress(addressText) {
  if (!addressText) return;
  const districtSelect = document.getElementById("district");
  const ugnsInput = document.getElementById("ugnsCode");
  if (!districtSelect || !ugnsInput) return;

  const text = addressText.toLowerCase();
  const match = districtsData.find((d) => text.includes(d.name.toLowerCase()));

  if (match) {
    districtSelect.value = match.code;
    ugnsInput.value = match.code;
    localStorage.setItem("district", match.code);
    localStorage.setItem("ugnsCode", match.code);
  }
}

/* ============================================================
   GPS
============================================================ */
function initGpsLocation() {
  const btn = document.getElementById("geoLocate");
  if (!btn) return;

  btn.addEventListener("click", () => {
    if (!navigator.geolocation) {
      alert("Ваш браузер не поддерживает GPS.");
      return;
    }

    btn.textContent = "Определение...";
    btn.disabled = true;

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude.toFixed(6);
        const lon = pos.coords.longitude.toFixed(6);

        const latEl = document.getElementById("tradeLat");
        const lonEl = document.getElementById("tradeLon");
        if (latEl) latEl.value = lat;
        if (lonEl) lonEl.value = lon;

        let address = "";
        try {
          // ИЗМЕНЕНО: убран User-Agent — браузер всё равно его не отправляет
          const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=ru`;
          const resp = await fetch(url);
          const data = await resp.json();
          address = data.display_name || "";
        } catch (e) {
          console.warn("Ошибка геокодирования:", e);
        }

        if (address) {
          const addrEl = document.getElementById("tradeAddress");
          if (addrEl) addrEl.value = address;
          updateDistrictFromAddress(address);
        } else {
          alert("Координаты получены, но адрес определить не удалось.");
        }

        btn.textContent = "Определить по GPS";
        btn.disabled = false;
      },
      (err) => {
        alert("Ошибка определения GPS: " + err.message);
        btn.textContent = "Определить по GPS";
        btn.disabled = false;
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  });
}

/* ============================================================
   SCROLL TO ERROR
============================================================ */
function scrollToFirstError() {
  const first = document.querySelector(".field-error");
  if (!first) return;
  first.scrollIntoView({ behavior: "smooth", block: "center" });
  first.style.transition = "background 0.3s";
  first.style.backgroundColor = "#ffdddd";
  setTimeout(() => { first.style.backgroundColor = ""; }, 800);
}

/* ============================================================
   DOM INIT
============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  initResponsibleBranchesSelect();

  // ВАЖНО: восстановить выбранный филиал из localStorage отдельно,
  // т.к. он не в autoSaveFields (заполняется динамически)
  const respSaved = localStorage.getItem("responsibleBranches");
  const respEl = document.getElementById("responsibleBranches");
  if (respEl && respSaved) respEl.value = respSaved;
  if (respEl) {
    respEl.addEventListener("change", () => {
      localStorage.setItem("responsibleBranches", respEl.value);
    });
  }

  // BUSINESS SELECTS
  const bo = document.getElementById("businessObjectType");
  const at = document.getElementById("activityType");

  if (bo) {
    // Placeholder
    const phOpt = document.createElement("option");
    phOpt.value = "";
    phOpt.textContent = "— выбрать —";
    bo.appendChild(phOpt);

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
    const phOpt = document.createElement("option");
    phOpt.value = "";
    phOpt.textContent = "— выбрать —";
    at.appendChild(phOpt);

    activityTypes.forEach((v) => {
      const opt = document.createElement("option");
      opt.value = v;
      opt.textContent = v;
      at.appendChild(opt);
    });
    const savedAT = localStorage.getItem("activityType");
    if (savedAT) at.value = savedAT;
  }

  // DISTRICTS
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

  // POS MODEL
  const posModel = document.getElementById("posModel");
  if (posModel) {
    const savedPos = localStorage.getItem("posModel");
    if (savedPos) posModel.value = savedPos;
    posModel.addEventListener("change", () => {
      localStorage.setItem("posModel", posModel.value);
    });
  }

  // ККМ Toggle + POS → KKM model linkage (Фаза 1)
  initKkmToggle();
  initPosModelLinkage();

  // TRADE ADDRESS → AUTO DISTRICT
  const tradeAddress = document.getElementById("tradeAddress");
  if (tradeAddress) {
    const handle = () => updateDistrictFromAddress(tradeAddress.value);
    tradeAddress.addEventListener("blur", handle);
    tradeAddress.addEventListener("change", handle);
    if (tradeAddress.value) handle();
  }

  // LEAFLET MAPS
  if (typeof initMap === "function") {
    initMap("legalMap", "legalAddress", "legalLat", "legalLon");
    initMap("tradeMap", "tradeAddress", "tradeLat", "tradeLon");
  }

  // CBS
  initCbsIntegration();

  // CLEAR
  const clearBtn = document.getElementById("clearForm");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (confirm("Очистить все поля формы?")) clearFormFields();
    });
  }

  // SIGNATURE
  initSignaturePadForPdf();

  // GPS
  initGpsLocation();

  // PRINT
  initPdfExportForPrint();
});

/* ============================================================
   LEAFLET MAP + REVERSE GEOCODING (с debounce)
============================================================ */
function formatNominatimAddress(data) {
  if (!data || !data.address) return data?.display_name || "";

  const a = data.address;
  const parts = [];

  let city = a.city || a.town || a.village || "";
  if (city) {
    city = city
      .replace(/^(г\.|город|гор\.|г|city)\s*/i, "")
      .replace(/\s*(город|г\.)$/i, "")
      .trim();
    city = city.replace(/^город\s+/i, "").trim();
    if (city.toLowerCase() === "бишкек" || city.toLowerCase() === "город бишкек") {
      city = "Бишкек";
    }
    parts.push("г. " + city);
  }

  if (a.city_district) parts.push(a.city_district);
  if (a.suburb) parts.push(a.suburb);

  let street = a.road || "";
  const house = a.house_number || "";

  if (street) {
    street = street
      .replace(/^(ул\.?|улица|str\.?)\s*/i, "")
      .replace(/\s+(улица|street)$/i, "")
      .trim();
    street = street.replace(/^([А-ЯЁ][а-яё]+)\s+([А-ЯЁ][а-яё]+)$/u, "$2 $1");
    street = street.replace(/\s+улица$/i, "");
    parts.push("ул. " + street + (house ? ", " + house : ""));
  }

  if (a.postcode) parts.push(a.postcode);
  if (a.country) parts.push(a.country);

  return parts.join(", ");
}

// Простой debounce-хелпер
function debounce(fn, wait) {
  let t;
  return function(...args) {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

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

  // Внутренний reverse geocoder, без debounce
  function doReverseGeocode(lat, lon) {
    const addrEl = document.getElementById(addressInputId);
    if (!addrEl) return;

    fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=ru`
    )
      .then((r) => r.json())
      .then((data) => {
        if (!data) return;
        const pretty = formatNominatimAddress(data);
        const text = pretty || data.display_name || "";
        if (text) {
          addrEl.value = text;
          localStorage.setItem(addressInputId, text);
          if (addressInputId === "tradeAddress") {
            updateDistrictFromAddress(text);
          }
        }
      })
      .catch(() => {});
  }

  // Debounced версия — 1.5 сек, чтобы не дёргать Nominatim при каждом перетаскивании
  const debouncedReverse = debounce(doReverseGeocode, 1500);

  function updateFields(lat, lon, doReverse = true) {
    const latEl = document.getElementById(latInputId);
    const lonEl = document.getElementById(lonInputId);

    if (latEl) {
      latEl.value = lat.toFixed(6);
      localStorage.setItem(latInputId, lat.toFixed(6));
    }
    if (lonEl) {
      lonEl.value = lon.toFixed(6);
      localStorage.setItem(lonInputId, lon.toFixed(6));
    }

    if (doReverse) {
      debouncedReverse(lat, lon);
    }
  }

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
   PDF FILL + PRINT
============================================================ */
function getPdfFieldValue(id) {
  const el = document.getElementById(id);
  return el ? (el.value || el.textContent || "").trim() : "";
}

function fillPdfTemplateForPrint() {
  // POS-документ
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
    ["lkLogin", "pdf_lkLogin"],
    ["lkPassword", "pdf_lkPassword"],
    ["description", "pdf_description"]
  ];

  pairs.forEach(([srcId, destId]) => {
    const src = document.getElementById(srcId);
    const dest = document.getElementById(destId);
    if (!dest) return;
    const value = src ? (src.value || src.textContent || "").trim() : "";
    dest.textContent = value;
  });

  const districtSelect = document.getElementById("district");
  const ugnsCode = document.getElementById("ugnsCode");
  const pdfDistrictUgns = document.getElementById("pdf_district_ugns");
  if (pdfDistrictUgns) {
    const districtText = districtSelect
      ? (districtSelect.options[districtSelect.selectedIndex]?.text || "").trim()
      : "";
    const ugns = ugnsCode ? (ugnsCode.value || "").trim() : "";
    pdfDistrictUgns.textContent = [districtText, ugns].filter(Boolean).join(" / ");
  }

  const commMap = [
    ["comm_visa_dkb", "pdf_comm_visa_dkb"],
    ["comm_bonus_dkb", "pdf_comm_bonus_dkb"],
    ["comm_visa_other", "pdf_comm_visa_other"],
    ["comm_elcart_dkb", "pdf_comm_elcart_dkb"],
    ["comm_elcart_other", "pdf_comm_elcart_other"],
    ["comm_mc_dkb", "pdf_comm_mc_dkb"],
    ["comm_mc_other", "pdf_comm_mc_other"]
  ];

  commMap.forEach(([srcId, destId]) => {
    const src = document.getElementById(srcId);
    const dest = document.getElementById(destId);
    if (!dest) return;
    const v = src ? (src.value || "").trim() : "";
    dest.textContent = v ? v.replace(".", ",") : "";
  });

  const discount10 = document.getElementById("discount_10");
  const pdfDiscount10 = document.getElementById("pdf_discount_10");
  if (pdfDiscount10) {
    const v = discount10 ? (discount10.value || "").trim() : "";
    pdfDiscount10.textContent = v ? v.replace(".", ",") : "";
  }

  const appDateInput = document.querySelector('input[name="applicationDate"]');
  const pdfDate = document.getElementById("pdf_date");
  if (pdfDate && appDateInput && appDateInput.value) {
    const d = new Date(appDateInput.value);
    if (!isNaN(d.getTime())) {
      const day = String(d.getDate()).padStart(2, "0");
      const months = [
        "января", "февраля", "марта", "апреля", "мая", "июня",
        "июля", "августа", "сентября", "октября", "ноября", "декабря"
      ];
      const monthName = months[d.getMonth()];
      const year = d.getFullYear();
      pdfDate.textContent = `«${day}» ${monthName} ${year} г.`;
    }
  }

  const sigData = getPdfFieldValue("signatureData");
  const pdfSigImg = document.getElementById("pdf_signature");
  if (pdfSigImg) {
    if (sigData) {
      pdfSigImg.src = sigData;
      pdfSigImg.style.display = "";
    } else {
      pdfSigImg.removeAttribute("src");
      pdfSigImg.style.display = "none";
    }
  }
}

/* ============================================================
   ЗАПОЛНЕНИЕ KKM-ШАБЛОНА (Фаза 3)
============================================================ */
function fillKkmTemplateForPrint() {
  const set = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = (value || "").trim();
  };

  set("kkm_companyName", getFieldValue("companyName"));
  set("kkm_companyBin", getFieldValue("companyBin"));
  set("kkm_legalAddress", getFieldValue("legalAddress"));

  // Место налоговой регистрации = район + код УГНС
  const districtSelect = document.getElementById("district");
  const districtText = districtSelect
    ? (districtSelect.options[districtSelect.selectedIndex]?.text || "")
    : "";
  set("kkm_taxAuthority",
    [districtText, getFieldValue("ugnsCode")].filter(Boolean).join(" / "));

  set("kkm_phone", getFieldValue("phone"));
  set("kkm_companyHeadInn", getFieldValue("companyHeadInn"));
  set("kkm_companyHead", getFieldValue("companyHead"));
  set("kkm_companyHead2", getFieldValue("companyHead"));
  set("kkm_headFio", getFieldValue("companyHead"));

  set("kkm_tradeAddress", getFieldValue("tradeAddress"));

  // Статус НДС — переводим код в человекочитаемое название
  const vatLabels = {
    "vat": "Плательщик НДС",
    "singleTax": "Единый налог",
    "simplified": "Упрощённая система",
    "patent": "Патент",
    "none": "Без регистрации НДС"
  };
  set("kkm_vatStatus", vatLabels[getFieldValue("vatStatus")] || "");

  set("kkm_taxRates", getFieldValue("taxRates"));
  set("kkm_objectName", getFieldValue("objectName"));
  set("kkm_businessObjectType", getFieldValue("businessObjectType"));

  const subjectLabels = {
    "goods": "Товар",
    "service": "Услуга",
    "work": "Работа",
    "mixed": "Товар + услуга"
  };
  set("kkm_paymentSubject", subjectLabels[getFieldValue("paymentSubject")] || "");

  set("kkm_activityType", getFieldValue("activityType"));

  const serial = getFieldValue("kkmSerialNumber");
  const version = getFieldValue("kkmVersion");
  set("kkm_serialAndVersion", [serial, version].filter(Boolean).join(" / "));

  set("kkm_kkmModel", getFieldValue("kkmModel"));
  set("kkm_rnm", getFieldValue("kkmRnm"));
  set("kkm_fn", getFieldValue("kkmFn"));
  set("kkm_reason", getFieldValue("kkmReason"));
  set("kkm_email", getFieldValue("email"));

  // Индекс + координаты в одну строку
  const postal = getFieldValue("postalCode");
  const lat = getFieldValue("tradeLat");
  const lon = getFieldValue("tradeLon");
  const coordStr = [
    postal ? postal : "",
    lat ? `широта: ${lat}` : "",
    lon ? `долгота: ${lon}` : ""
  ].filter(Boolean).join(", ");
  set("kkm_postalAndCoords", coordStr);

  // Логин + пароль
  const login = getFieldValue("lkLogin");
  const pass = getFieldValue("lkPassword");
  set("kkm_lkCreds", [login, pass].filter(Boolean).join("   "));

  // Подпись
  const sigData = getPdfFieldValue("signatureData");
  const kkmSig = document.getElementById("kkm_signature");
  if (kkmSig) {
    if (sigData) {
      kkmSig.src = sigData;
      kkmSig.style.display = "";
    } else {
      kkmSig.removeAttribute("src");
      kkmSig.style.display = "none";
    }
  }
}

/* ============================================================
   ПЕЧАТЬ
   - Сначала POS
   - Если выбрано "С ККМ" → после печати POS confirm("Печатать ККМ?")
   - Если Да → второе окно с шаблоном ККМ
============================================================ */
function openPrintWindow(templateId, classToAdd) {
  const tpl = document.getElementById(templateId);
  if (!tpl) {
    alert("Шаблон " + templateId + " не найден!");
    return null;
  }

  const win = window.open("", "_blank");
  if (!win) {
    alert("Разрешите всплывающие окна для печати.");
    return null;
  }

  win.document.write(`
    <!doctype html>
    <html><head><meta charset="utf-8"><title>Demir POS Form</title>
    <style>
      body { margin: 0; padding: 0; font-family: 'Times New Roman', serif; }
      @page { size: A4; margin: 12mm; }
    </style>
    </head><body></body></html>
  `);
  win.document.close();

  const clone = tpl.cloneNode(true);
  clone.style.display = "block";
  clone.style.width = "800px";
  clone.style.margin = "0 auto";
  win.document.body.appendChild(clone);

  return win;
}

function initPdfExportForPrint() {
  const btn = document.getElementById("savePdf");
  if (!btn) return;

  btn.addEventListener("click", async () => {
    if (!validatePdfRequiredFields()) return;

    // Заготовка SLK JSON — пока только в консоль
    try {
      const slkPayload = collectFormDataForSLK();
      console.log("SLK JSON (отправка отключена):", JSON.stringify(slkPayload, null, 2));
    } catch (e) {
      console.warn("Не удалось собрать SLK JSON:", e);
    }

    // Заполняем шаблоны
    fillPdfTemplateForPrint();

    // 1) ПЕЧАТЬ POS
    const posWin = openPrintWindow("pdfDocument", "printing-pos");
    if (!posWin) return;

    setTimeout(() => {
      posWin.print();
      posWin.close();

      // 2) Если выбрано "С ККМ" — спрашиваем
      const isWithKkm = document.querySelector('input[name="terminalType"]:checked')?.value === "withKKM";
      if (!isWithKkm) return;

      const wantKkm = confirm("Документ POS отправлен на печать.\n\nПечатать заявление на ККМ?");
      if (!wantKkm) return;

      fillKkmTemplateForPrint();

      const kkmWin = openPrintWindow("kkmDocument", "printing-kkm");
      if (!kkmWin) return;

      setTimeout(() => {
        kkmWin.print();
        kkmWin.close();
      }, 300);
    }, 300);
  });
}

/* ============================================================
   SIGNATURE PAD
============================================================ */
function initSignaturePadForPdf() {
  const canvas = document.getElementById("signaturePad");
  const clearBtn = document.getElementById("signatureClear");
  const hiddenInput = document.getElementById("signatureData");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let drawing = false;
  let lastX = 0;
  let lastY = 0;

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, rect.width, rect.height);
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    return { x: clientX - rect.left, y: clientY - rect.top };
  }

  function startDraw(x, y) { drawing = true; lastX = x; lastY = y; }

  function drawLine(x, y) {
    if (!drawing) return;
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();
    lastX = x;
    lastY = y;
  }

  function stopDraw() {
    if (!drawing) return;
    drawing = false;
    const dataURL = canvas.toDataURL("image/png");
    if (hiddenInput) hiddenInput.value = dataURL;
  }

  canvas.addEventListener("mousedown", (e) => {
    e.preventDefault();
    const { x, y } = getPos(e);
    startDraw(x, y);
  });
  canvas.addEventListener("mousemove", (e) => {
    if (!drawing) return;
    const { x, y } = getPos(e);
    drawLine(x, y);
  });
  window.addEventListener("mouseup", stopDraw);

  canvas.addEventListener("touchstart", (e) => {
    e.preventDefault();
    const { x, y } = getPos(e);
    startDraw(x, y);
  });
  canvas.addEventListener("touchmove", (e) => {
    e.preventDefault();
    const { x, y } = getPos(e);
    drawLine(x, y);
  });
  canvas.addEventListener("touchend", (e) => {
    e.preventDefault();
    stopDraw();
  });

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      const dpr = window.devicePixelRatio || 1;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.beginPath();
      if (hiddenInput) hiddenInput.value = "";
      drawing = false; lastX = 0; lastY = 0;
    });
  }
}

/* ============================================================
   ВАЛИДАЦИЯ
   Поля ККМ обязательны только если выбрано "С ККМ"
============================================================ */
const pdfRequiredFieldLabels = {
  companyName: "Наименование юридического лица / ИП",
  companyBin: "ИНН/БИН",
  companyHead: "ФИО руководителя",
  manager: "Сотрудник, привлекший клиента",
  phone: "Контактный телефон",
  email: "E-mail",
  legalAddress: "Юридический адрес",
  tradeAddress: "Адрес торговой точки",
  businessObjectType: "Тип объекта бизнеса",
  activityType: "Вид деятельности",
  posModel: "Модель POS-терминала",
  district: "Район (по месту торговли)",
  ugnsCode: "Код УГНС",
  responsibleBranches: "Ответственный филиал",
  lkLogin: "Логин от lk.salyk.kg (e-mail)",
  lkPassword: "Пароль от lk.salyk.kg",
  clientStatus: "Статус клиента",
  description: "Комментарий / описание"
};

// Поля, обязательные ТОЛЬКО при "С ККМ"
const kkmRequiredFieldLabels = {
  objectName: "Наименование объекта (для ККМ)",
  vatStatus: "Статус по регистрации НДС",
  taxRates: "Налоговые ставки",
  paymentSubject: "Предмет расчёта",
  postalCode: "Почтовый индекс"
  // Заводской №, РНМ, ФН — НЕ обязательны на подаче
  // (заполняются ЦТО / налоговой после регистрации)
};

function clearPdfValidationErrors() {
  document.querySelectorAll(".field-error").forEach((el) => el.classList.remove("field-error"));
}

function validateRequiredCheckboxGroups() {
  const missingGroups = [];

  const typeGroup = document.querySelectorAll('input[name="requestType"]');
  const typeSelected = Array.from(typeGroup).some((ch) => ch.checked);
  if (!typeSelected) {
    missingGroups.push("Тип заявки (нужно выбрать хотя бы один вариант)");
    typeGroup.forEach((ch) => ch.classList.add("field-error"));
  }

  // ИЗМЕНЕНО: terminalType теперь radio
  const posGroup = document.querySelectorAll('input[name="terminalType"]');
  const posSelected = Array.from(posGroup).some((ch) => ch.checked);
  if (!posSelected) {
    missingGroups.push("Тип POS-терминала (С ККМ или Без ККМ)");
    posGroup.forEach((ch) => ch.classList.add("field-error"));
  }

  // ДОБАВЛЕНО: проверка cardTypes
  const cardGroup = document.querySelectorAll('input[name="cardTypes"]');
  const cardSelected = Array.from(cardGroup).some((ch) => ch.checked);
  if (!cardSelected) {
    missingGroups.push("Типы карточек (нужно выбрать хотя бы одну)");
    cardGroup.forEach((ch) => ch.classList.add("field-error"));
  }

  return { ok: missingGroups.length === 0, missing: missingGroups };
}

function validatePdfRequiredFields() {
  clearPdfValidationErrors();
  const missing = [];

  // Базовые обязательные
  Object.keys(pdfRequiredFieldLabels).forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const value = (el.value || el.textContent || "").trim();
    if (!value) {
      missing.push(pdfRequiredFieldLabels[id]);
      el.classList.add("field-error");
    }
  });

  // Обязательные при "С ККМ"
  const isWithKkm = document.querySelector('input[name="terminalType"]:checked')?.value === "withKKM";
  if (isWithKkm) {
    Object.keys(kkmRequiredFieldLabels).forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const value = (el.value || el.textContent || "").trim();
      if (!value) {
        missing.push(kkmRequiredFieldLabels[id] + " (ККМ)");
        el.classList.add("field-error");
      }
    });
  }

  const cb = validateRequiredCheckboxGroups();
  if (!cb.ok) missing.push(...cb.missing);

  if (missing.length > 0) {
    alert("Пожалуйста, заполните обязательные поля:\n\n- " + missing.join("\n- "));
    scrollToFirstError();
    return false;
  }
  return true;
}

/* ============================================================
   ОЧИСТКА ФОРМЫ
============================================================ */
function clearFormFields() {
  clearPdfValidationErrors();

  autoSaveFields.forEach((id) => {
    localStorage.removeItem(id);
    const el = document.getElementById(id);
    if (!el) return;
    if (el.tagName === "SELECT") {
      el.selectedIndex = 0;
    } else if (el.type === "checkbox" || el.type === "radio") {
      el.checked = false;
    } else {
      el.value = "";
    }
  });

  document.querySelectorAll(".card input[type='checkbox'], .card input[type='radio']")
    .forEach((el) => (el.checked = false));

  // ККМ-режим сброс
  localStorage.removeItem("terminalType");
  body.classList.remove("kkm-active");

  // Поля, не входящие в autoSaveFields
  ["contractNumber", "contractDate", "applicationNumber", "applicationDate",
   "mobilePhone", "workFrom", "workTo", "lkPassword"].forEach((id) => {
    const el = document.getElementById(id) || document.querySelector(`[name="${id}"]`);
    if (el) el.value = "";
  });

  const resp = document.getElementById("responsibleBranches");
  if (resp) {
    resp.selectedIndex = 0;
    localStorage.removeItem("responsibleBranches");
  }

  // Подпись
  const canvas = document.getElementById("signaturePad");
  const hiddenInput = document.getElementById("signatureData");
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  if (hiddenInput) hiddenInput.value = "";

  const pdfImg = document.getElementById("pdf_signature");
  if (pdfImg) { pdfImg.removeAttribute("src"); pdfImg.style.display = "none"; }
  const kkmImg = document.getElementById("kkm_signature");
  if (kkmImg) { kkmImg.removeAttribute("src"); kkmImg.style.display = "none"; }
}
