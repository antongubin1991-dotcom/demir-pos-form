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
      description: getFieldValue("description"),
      lkLogin:     getFieldValue("lkLogin"),     // ← НОВОЕ
      lkPassword:  getFieldValue("lkPassword"),
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

/* Отправка данных в SLK (или лог в консоль, если эндпоинт не задан) */
async function sendToSLK(payload) {
  try {
    if (!SLK_ENDPOINT) {
      console.log("JSON для SLK (SLK_ENDPOINT не настроен):", payload);
      return;
    }

    const response = await fetch(SLK_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Ошибка отправки в SLK:", response.status, text);
      alert("Ошибка отправки данных в SLK. Подробности смотри в консоли.");
    } else {
      console.log("Успешно отправлено в SLK");
    }
  } catch (err) {
    console.error("Сетевая ошибка при отправке в SLK:", err);
    alert("Сетевая ошибка при отправке в SLK. Подробности смотри в консоли.");
  }
}
/* ============================================================
   CBS ENDPOINT (поиск по ИНН для действующих клиентов)
============================================================ */
const CBS_ENDPOINT = ""; 
// например: "/api/cbs/client-by-inn"
// ожидаем, что backend вернёт JSON вида:
// {
//   "companyName": "...",
//   "companyBin": "...",
//   "companyHead": "...",
//   "companyHeadInn": "...",
//   "email": "...",
//   "phone": "...",
//   "legalAddress": "...",
//   "tradeAddress": "..."
// }
function fillFormFromCbs(data) {
  if (!data) return;

  // Компания
  if (data.companyName) {
    const el = document.getElementById("companyName");
    if (el && !el.value) el.value = data.companyName;
  }
  if (data.companyBin) {
    const el = document.getElementById("companyBin");
    if (el && !el.value) el.value = data.companyBin;
  }
  if (data.companyHead) {
    const el = document.getElementById("companyHead");
    if (el && !el.value) el.value = data.companyHead;
  }
  if (data.companyHeadInn) {
    const el = document.getElementById("companyHeadInn");
    if (el && !el.value) el.value = data.companyHeadInn;
  }

  // Контакты
  if (data.email) {
    const el = document.getElementById("email");
    if (el && !el.value) el.value = data.email;
  }
  if (data.phone) {
    const el = document.getElementById("phone");
    if (el && !el.value) el.value = data.phone;
  }

  // Адреса
  if (data.legalAddress) {
    const el = document.getElementById("legalAddress");
    if (el && !el.value) el.value = data.legalAddress;
  }
  if (data.tradeAddress) {
    const el = document.getElementById("tradeAddress");
    if (el && !el.value) el.value = data.tradeAddress;
  }

  // если ещё что-то понадобится из CBS — допишем сюда
}
async function fetchCbsByInn(inn) {
  if (!CBS_ENDPOINT) {
    console.log("CBS_ENDPOINT не настроен, пропускаем запрос к CBS. ИНН:", inn);
    return null;
  }

  try {
    const res = await fetch(CBS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inn: inn.trim() })
    });

    if (!res.ok) {
      console.error("Ошибка ответа CBS:", res.status, await res.text());
      alert("Не удалось получить данные клиента из CBS. Проверьте ИНН или попробуйте позже.");
      return null;
    }

    const data = await res.json();
    if (!data) {
      alert("По указанному ИНН данные клиента в CBS не найдены.");
      return null;
    }

    return data;
  } catch (e) {
    console.error("Сетевая ошибка при запросе в CBS:", e);
    alert("Ошибка подключения к CBS. Проверьте сеть или обратитесь в ИТ.");
    return null;
  }
}
function initCbsIntegration() {
  const statusSelect = document.getElementById("clientStatus");
  const innInput = document.getElementById("companyBin");

  if (!statusSelect || !innInput) return;

  async function tryFetchIfExisting() {
    const status = statusSelect.value;
    const inn = (innInput.value || "").trim();

    if (status !== "existing") return;
    if (inn.length < 8) return; // минимальная длина, можно 14, если строго ИНН

    const data = await fetchCbsByInn(inn);
    if (data) {
      fillFormFromCbs(data);
    }
  }

  // При смене статуса на "действующий" — если ИНН уже введён, сразу тянем CBS
  statusSelect.addEventListener("change", () => {
    if (statusSelect.value === "existing") {
      tryFetchIfExisting();
    }
  });

  // При потере фокуса / изменении ИНН — если статус "действующий", тянем CBS
  innInput.addEventListener("blur", () => {
    tryFetchIfExisting();
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
  "lkLogin", "lkPassword",
  "description",
  "clientStatus"
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
  const btn = document.getElementById("langBtn");
  const menu = document.getElementById("langMenu");
  if (btn && menu) {
    btn.addEventListener("click", () => {
      menu.classList.toggle("hidden");
    });
    menu.querySelectorAll("div").forEach(item => {
      item.addEventListener("click", () => {
        const lang = item.dataset.lang;
        localStorage.setItem("lang", lang);
        btn.textContent = lang.toUpperCase() + " ▼";
        applyTranslations(lang);
        menu.classList.add("hidden");
      });
    });

    // стартовое значение
    const savedLang = localStorage.getItem("lang") || "ru";
    btn.textContent = savedLang.toUpperCase() + " ▼";
    applyTranslations(savedLang);
  }
});
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
/* ============================================================
   LEAFLET MAP + REVERSE GEOCODING
============================================================ */

// Красивое форматирование адреса из ответа Nominatim
function formatNominatimAddress(data) {
  if (!data || !data.address) {
    return data?.display_name || "";
  }

  const a = data.address;
  const parts = [];

  // ---------- ГОРОД ----------
  let city = a.city || a.town || a.village || "";

  if (city) {
    city = city
      .replace(/^(г\.|город|гор\.|г|city)\s*/i, "") // убираем любое начало
      .replace(/\s*(город|г\.)$/i, "") // убираем хвост
      .trim();

    // если Nominatim отдаёт "город Бишкек"
    city = city.replace(/^город\s+/i, "").trim();

    if (city.toLowerCase() === "бишкек" || city.toLowerCase() === "город бишкек") {
      city = "Бишкек";
    }

    parts.push("г. " + city);
  }

  // ---------- РАЙОН ----------
  if (a.city_district) parts.push(a.city_district);

  // ---------- Ж/м ----------
  if (a.suburb) parts.push(a.suburb);

  // ---------- УЛИЦА ----------
  let street = a.road || "";
  let house = a.house_number || "";

  if (street) {
    street = street
      .replace(/^(ул\.?|улица|str\.?)\s*/i, "")       // убираем начало
      .replace(/\s+(улица|street)$/i, "")            // убираем конец
      .trim();

    // частый баг Nominatim: Фрунзе Михаила → Михаила Фрунзе
    street = street.replace(
      /^([А-ЯЁ][а-яё]+)\s+([А-ЯЁ][а-яё]+)$/u,
      "$2 $1"
    );

    // убираем удвоенные имена: «Фрунзе Михаила улица»
    street = street.replace(/\s+улица$/i, "");

    parts.push("ул. " + street + (house ? ", " + house : ""));
  }

  // ---------- ИНДЕКС ----------
  if (a.postcode) parts.push(a.postcode);

  // ---------- СТРАНА ----------
  if (a.country) parts.push(a.country);

  return parts.join(", ");
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

// ============================================================
// PDF + подпись — независимый блок (не ломает старый код)
// ============================================================

const SLK_ENDPOINT_PDF = ""; // при желании укажешь отдельный endpoint

function getPdfFieldValue(id) {
  const el = document.getElementById(id);
  return el ? (el.value || el.textContent || "").trim() : "";
}

// Сбор данных (если нужно отдельным JSON для логирования)
function collectPdfFormData() {
  return {
    company: {
      name:        getPdfFieldValue("companyName"),
      bin:         getPdfFieldValue("companyBin"),
      head:        getPdfFieldValue("companyHead"),
      manager:     getPdfFieldValue("manager"),
      description: getPdfFieldValue("description"),
      lkLogin:     getPdfFieldValue("lkLogin"),
      lkPassword:  getPdfFieldValue("lkPassword"),
      clientStatus:getPdfFieldValue("clientStatus"),
    },
    contacts: {
      phone: getPdfFieldValue("phone"),
      email: getPdfFieldValue("email"),
    },
    pos: {
      model: getPdfFieldValue("posModel"),
      commissions: {
        comm_visa_dkb:     getPdfFieldValue("comm_visa_dkb"),
        comm_bonus_dkb:    getPdfFieldValue("comm_bonus_dkb"),
        comm_visa_other:   getPdfFieldValue("comm_visa_other"),
        comm_elcart_dkb:   getPdfFieldValue("comm_elcart_dkb"),
        comm_elcart_other: getPdfFieldValue("comm_elcart_other"),
        comm_mc_dkb:       getPdfFieldValue("comm_mc_dkb"),
        comm_mc_other:     getPdfFieldValue("comm_mc_other"),
      },
      discount_10: getPdfFieldValue("discount_10"),
    },
    region: {
      district:     getPdfFieldValue("district"),
      ugnsCode:     getPdfFieldValue("ugnsCode"),
      legalAddress: getPdfFieldValue("legalAddress"),
      legalLat:     getPdfFieldValue("legalLat"),
      legalLon:     getPdfFieldValue("legalLon"),
      tradeAddress: getPdfFieldValue("tradeAddress"),
      tradeLat:     getPdfFieldValue("tradeLat"),
      tradeLon:     getPdfFieldValue("tradeLon"),
    },
    business: {
      objectType:   getPdfFieldValue("businessObjectType"),
      activityType: getPdfFieldValue("activityType"),
    },
    signature: getPdfFieldValue("signatureData"),
    meta: {
      createdAt: new Date().toISOString(),
      userAgent: navigator.userAgent,
    },
  };
}

async function sendPdfJsonToSLK(payload) {
  if (!SLK_ENDPOINT_PDF) {
    console.log("PDF JSON (SLK_ENDPOINT_PDF не настроен):", payload);
    return;
  }

  try {
    const res = await fetch(SLK_ENDPOINT_PDF, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      console.error("Ошибка отправки PDF JSON:", res.status, await res.text());
    }
  } catch (e) {
    console.error("Сетевая ошибка отправки PDF JSON:", e);
  }
}
// Заполнение скрытого шаблона PDF
function fillPdfTemplateForPrint() {
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
    ["lkLogin", "pdf_lkLogin"],       // логин lk.salyk.kg
    ["lkPassword", "pdf_lkPassword"], // пароль lk.salyk.kg
    ["description", "pdf_description"],
  ];

  pairs.forEach(([srcId, destId]) => {
    const src = document.getElementById(srcId);
    const dest = document.getElementById(destId);
    if (!dest) return;
    const value = src ? (src.value || src.textContent || "").trim() : "";
    dest.textContent = value;
  });

  // Район + УГНС
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

  // Комиссии
  const commMap = [
    ["comm_visa_dkb", "pdf_comm_visa_dkb"],
    ["comm_bonus_dkb", "pdf_comm_bonus_dkb"],
    ["comm_visa_other", "pdf_comm_visa_other"],
    ["comm_elcart_dkb", "pdf_comm_elcart_dkb"],
    ["comm_elcart_other", "pdf_comm_elcart_other"],
    ["comm_mc_dkb", "pdf_comm_mc_dkb"],
    ["comm_mc_other", "pdf_comm_mc_other"],
  ];

  commMap.forEach(([srcId, destId]) => {
    const src = document.getElementById(srcId);
    const dest = document.getElementById(destId);
    if (!dest) return;
    const v = src ? (src.value || "").trim() : "";
    dest.textContent = v ? v.replace(".", ",") : "";
  });

  // Скидка
  const discount10 = document.getElementById("discount_10");
  const pdfDiscount10 = document.getElementById("pdf_discount_10");
  if (pdfDiscount10) {
    const v = discount10 ? (discount10.value || "").trim() : "";
    pdfDiscount10.textContent = v ? v.replace(".", ",") : "";
  }

  // Дата заявки → pdf_date (если заполняешь поле applicationDate)
  const appDateInput = document.querySelector('input[name="applicationDate"]');
  const pdfDate = document.getElementById("pdf_date");
  if (pdfDate && appDateInput && appDateInput.value) {
    const d = new Date(appDateInput.value);
    if (!isNaN(d.getTime())) {
      const day = String(d.getDate()).padStart(2, "0");
      const months = [
        "января","февраля","марта","апреля","мая","июня",
        "июля","августа","сентября","октября","ноября","декабря"
      ];
      const monthName = months[d.getMonth()];
      const year = d.getFullYear();
      pdfDate.textContent = `«${day}» ${monthName} ${year} г.`;
    }
  }

  // Подпись
  const sigData = getPdfFieldValue("signatureData");
  const pdfSigImg = document.getElementById("pdf_signature");
  if (pdfSigImg && sigData) {
    pdfSigImg.src = sigData;
  }
}
// ============================================================
// ВАЛИДАЦИЯ ОБЯЗАТЕЛЬНЫХ ПОЛЕЙ ДЛЯ PDF
// ============================================================

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

function clearPdfValidationErrors() {
  document.querySelectorAll(".field-error").forEach((el) => {
    el.classList.remove("field-error");
  });
}

function validatePdfRequiredFields() {
  clearPdfValidationErrors();

  const missing = [];

  Object.keys(pdfRequiredFieldLabels).forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;

    const value = (el.value || el.textContent || "").trim();
    if (!value) {
      missing.push(pdfRequiredFieldLabels[id]);
      el.classList.add("field-error");
    }
  });

  if (missing.length > 0) {
    alert(
      "Пожалуйста, заполните обязательные поля:\n\n- " +
      missing.join("\n- ")
    );
    return false;
  }

  return true;
}
// ============================================================
// ОЧИСТКА ФОРМЫ
// ============================================================
function clearFormFields() {
  // убираем подсветку ошибок
  clearPdfValidationErrors();

  // чистим все поля, которые сохраняем в localStorage
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

  // чекбоксы типов заявок / карт и т.п.
  document
    .querySelectorAll(".card input[type='checkbox'], .card input[type='radio']")
    .forEach((el) => (el.checked = false));

  // поля, которых нет в autoSaveFields, но их тоже полезно сбросить
  [
    "contractNumber",
    "contractDate",
    "applicationNumber",
    "applicationDate",
    "mobilePhone",
    "workFrom",
    "workTo"
  ].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });

  // ответственное отделение
  const resp = document.getElementById("responsibleBranches");
  if (resp) resp.selectedIndex = 0;

  // подпись
  const canvas = document.getElementById("signaturePad");
  const hiddenInput = document.getElementById("signatureData");
  const pdfImg = document.getElementById("pdf_signature");
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  if (hiddenInput) hiddenInput.value = "";
  if (pdfImg) pdfImg.removeAttribute("src");
}
// Обработчик кнопки "Сохранить PDF"
function initPdfExportForPrint() {
  const btn = document.getElementById("savePdf");
  if (!btn) return;

  btn.addEventListener("click", async () => {
    if (!validatePdfRequiredFields()) {
      return;
    }

    const payload = collectPdfFormData();
    await sendPdfJsonToSLK(payload);

    fillPdfTemplateForPrint(); // если используешь, либо переименуй под свою функцию

    const pdfElement = document.getElementById("pdfDocument");
    if (!pdfElement) {
      console.error("pdfDocument не найден");
      return;
    }

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Разрешите всплывающие окна для печати PDF");
      return;
    }

    printWindow.document.open();
    printWindow.document.write(`
<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8" />
  <title>Demir POS Form</title>
</head>
<body></body>
</html>`);
    printWindow.document.close();

    const clone = pdfElement.cloneNode(true);
    clone.style.display = "block";
    clone.style.margin = "20px auto";
    clone.style.width = "800px";

    printWindow.document.body.appendChild(clone);

    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }, 100);
  });
}

// Инициализация подписи и PDF-блока
document.addEventListener("DOMContentLoaded", () => {
  initSignaturePadForPdf();
  initPdfExportForPrint();
});

// ============================================================
// SIMPLE SPELLCHECK MOCK
// ============================================================
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
