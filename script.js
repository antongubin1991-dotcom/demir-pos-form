// ===============================================
// НАСТРОЙКИ И КОНСТАНТЫ
// ===============================================

// Укажи здесь URL своего API SLK, например:
// const SLK_ENDPOINT = "https://slk.goodoo.kg/api/demir-pos-form";
const SLK_ENDPOINT = ""; // пока пусто — будет только console.log

const DEFAULT_CENTER = [42.8746, 74.6122]; // Бишкек
const DEFAULT_ZOOM = 13;

// ===============================================
// УТИЛИТЫ ДЛЯ ТЕМЫ И ЯЗЫКА
// ===============================================

function initTheme() {
  const body = document.body;
  const select = document.getElementById("themeToggle");

  const saved = localStorage.getItem("demir_theme") || "light";
  body.classList.remove("light", "dark");
  body.classList.add(saved);
  if (select) select.value = saved;

  if (select) {
    select.addEventListener("change", () => {
      const val = select.value === "dark" ? "dark" : "light";
      body.classList.remove("light", "dark");
      body.classList.add(val);
      localStorage.setItem("demir_theme", val);
    });
  }
}

function initLang() {
  const select = document.getElementById("langSelect");
  const saved = localStorage.getItem("demir_lang") || "ru";
  if (select) select.value = saved;

  if (typeof setLanguage === "function") {
    setLanguage(saved);
  }

  if (select) {
    select.addEventListener("change", () => {
      const lang = select.value || "ru";
      localStorage.setItem("demir_lang", lang);
      if (typeof setLanguage === "function") {
        setLanguage(lang);
      }
    });
  }
}

// ===============================================
// LEAFLET КАРТЫ
// ===============================================

let legalMap, tradeMap;

function initMap(mapId, latInputId, lonInputId) {
  const mapEl = document.getElementById(mapId);
  const latInput = document.getElementById(latInputId);
  const lonInput = document.getElementById(lonInputId);

  if (!mapEl || !latInput || !lonInput || typeof L === "undefined") {
    console.warn("Leaflet map init skipped for", mapId);
    return null;
  }

  const map = L.map(mapId).setView(DEFAULT_CENTER, DEFAULT_ZOOM);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  let marker = null;

  function hasCoords() {
    return (
      latInput.value &&
      lonInput.value &&
      !isNaN(parseFloat(latInput.value)) &&
      !isNaN(parseFloat(lonInput.value))
    );
  }

  if (hasCoords()) {
    const lat = parseFloat(latInput.value);
    const lon = parseFloat(lonInput.value);
    marker = L.marker([lat, lon]).addTo(map);
    map.setView([lat, lon], DEFAULT_ZOOM);
  }

  map.on("click", (e) => {
    const { lat, lng } = e.latlng;
    latInput.value = lat.toFixed(6);
    lonInput.value = lng.toFixed(6);

    if (marker) {
      marker.setLatLng([lat, lng]);
    } else {
      marker = L.marker([lat, lng]).addTo(map);
    }
  });

  function updateMarkerFromInputs() {
    if (!hasCoords()) return;
    const lat = parseFloat(latInput.value);
    const lon = parseFloat(lonInput.value);
    if (isNaN(lat) || isNaN(lon)) return;

    if (marker) {
      marker.setLatLng([lat, lon]);
    } else {
      marker = L.marker([lat, lon]).addTo(map);
    }
    map.setView([lat, lon], DEFAULT_ZOOM);
  }

  ["change", "blur"].forEach((ev) => {
    latInput.addEventListener(ev, updateMarkerFromInputs);
    lonInput.addEventListener(ev, updateMarkerFromInputs);
  });

  return map;
}

// ===============================================
// СБОР ВСЕХ ДАННЫХ ФОРМЫ В JSON
// ===============================================

function val(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : "";
}

function collectFormData() {
  const data = {
    company: {
      name: val("companyName"),
      bin: val("companyBin"),
      headFio: val("companyHead"),
      headInn: val("companyHeadInn"),
    },
    contacts: {
      phone: val("phone"),
      email: val("email"),
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
        mcOther: val("comm_mc_other"),
      },
      discounts: {
        discount10: val("discount_10"),
      },
    },
    region: {
      districtCode: val("district"),
      ugnsCode: val("ugnsCode"),
    },
    business: {
      objectType: val("businessObjectType"),
      activityType: val("activityType"),
    },
    addresses: {
      legal: {
        address: val("legalAddress"),
        lat: val("legalLat"),
        lon: val("legalLon"),
      },
      trade: {
        address: val("tradeAddress"),
        lat: val("tradeLat"),
        lon: val("tradeLon"),
      },
    },
    comment: val("description"),
    manager: val("manager"), // сотрудник, привлекший клиента
    meta: {
      lang: localStorage.getItem("demir_lang") || "ru",
      theme: localStorage.getItem("demir_theme") || "light",
      createdAt: new Date().toISOString(),
    },
  };

  return data;
}

// ===============================================
// ОТПРАВКА В SLK
// ===============================================

async function sendToSLK(payload) {
  if (!SLK_ENDPOINT) {
    console.log("JSON для SLK (SLK_ENDPOINT не настроен):", payload);
    return;
  }

  try {
    const resp = await fetch(SLK_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      console.error("SLK: HTTP error", resp.status);
      return;
    }

    const data = await resp.json().catch(() => null);
    console.log("SLK: успех", data);
  } catch (e) {
    console.error("SLK: ошибка сети/JS", e);
  }
}

// ===============================================
// ЗАПОЛНЕНИЕ PDF И СОЗДАНИЕ ФАЙЛА
// ===============================================

function setPdfText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text || "";
}

function fillPdfFromForm(formData) {
  setPdfText("pdf_companyName", formData.company.name);
  setPdfText("pdf_companyBin", formData.company.bin);
  setPdfText("pdf_companyHead", formData.company.headFio);
  setPdfText("pdf_manager", formData.manager);
  setPdfText("pdf_phone", formData.contacts.phone);
  setPdfText("pdf_email", formData.contacts.email);

  setPdfText("pdf_legalAddress", formData.addresses.legal.address);
  setPdfText("pdf_tradeAddress", formData.addresses.trade.address);

  const districtName = (() => {
    const sel = document.getElementById("district");
    if (!sel) return formData.region.districtCode;
    const opt = sel.options[sel.selectedIndex];
    return opt ? opt.textContent.trim() : formData.region.districtCode;
  })();

  setPdfText(
    "pdf_district_ugns",
    `${districtName || ""}${formData.region.ugnsCode ? " / " + formData.region.ugnsCode : ""}`
  );

  setPdfText("pdf_businessObjectType", formData.business.objectType);
  setPdfText("pdf_activityType", formData.business.activityType);
  setPdfText("pdf_posModel", formData.pos.model);

  setPdfText("pdf_comm_visa_dkb", formData.pos.commissions.visaDkb);
  setPdfText("pdf_comm_bonus_dkb", formData.pos.commissions.bonusDkb);
  setPdfText("pdf_comm_visa_other", formData.pos.commissions.visaOther);
  setPdfText("pdf_comm_elcart_dkb", formData.pos.commissions.elcartDkb);
  setPdfText("pdf_comm_elcart_other", formData.pos.commissions.elcartOther);
  setPdfText("pdf_comm_mc_dkb", formData.pos.commissions.mcDkb);
  setPdfText("pdf_comm_mc_other", formData.pos.commissions.mcOther);

  setPdfText("pdf_discount_10", formData.pos.discounts.discount10);

  const descEl = document.getElementById("pdf_description");
  if (descEl) {
    descEl.textContent = formData.comment || "";
  }

  // дата в шапке — можно оставить пустой или текущую
  const pdfDateEl = document.getElementById("pdf_date");
  if (pdfDateEl) {
    const now = new Date();
    const d = String(now.getDate()).padStart(2, "0");
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const y = now.getFullYear();
    pdfDateEl.textContent = `«${d}» ${m}.${y} г.`;
  }
}

function generatePdf() {
  const pdfNode = document.getElementById("pdfDocument");
  if (!pdfNode || typeof html2pdf === "undefined") {
    console.warn("html2pdf или pdfDocument не найдены");
    return;
  }

  const opt = {
    margin: 10,
    filename: "DemirPOS_Zayavka.pdf",
    image: { type: "jpeg", quality: 0.95 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };

  html2pdf().set(opt).from(pdfNode).save();
}

// ===============================================
// ПРОСТОЙ СПЕЛЛЧЕК (ЗАГЛУШКА)
// ===============================================

function initSpellcheck() {
  const panel = document.getElementById("spellcheckPanel");
  if (!panel) return;
  panel.textContent =
    "Проверка орфографии пока не подключена. Здесь можно будет выводить замечания.";
}

// ===============================================
// ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ
// ===============================================

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initLang();
  initSpellcheck();

  legalMap = initMap("legalMap", "legalLat", "legalLon");
  tradeMap = initMap("tradeMap", "tradeLat", "tradeLon");

  const saveBtn = document.getElementById("savePdf");
  if (saveBtn) {
    saveBtn.addEventListener("click", async () => {
      // 1. Собираем данные
      const formData = collectFormData();

      // 2. Отправляем JSON в SLK (или просто лог, если URL не указан)
      await sendToSLK(formData);

      // 3. Заполняем PDF и сохраняем файл
      fillPdfFromForm(formData);
      generatePdf();
    });
  }
});
