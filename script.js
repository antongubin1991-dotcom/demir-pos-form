// ============================================================
// THEME TOGGLE
// ============================================================
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

// ============================================================
// LANG TOGGLE (заглушка, если translations.js есть — будет работать)
// ============================================================
const langSelect = document.getElementById("langSelect");

if (langSelect && window.TRANSLATIONS) {
  const savedLang = localStorage.getItem("lang") || "ru";
  langSelect.value = savedLang;

  const applyLang = (lang) => {
    document.querySelectorAll("[data-key]").forEach((el) => {
      const key = el.getAttribute("data-key");
      const dict = window.TRANSLATIONS[lang] || window.TRANSLATIONS["ru"] || {};
      if (dict[key]) el.textContent = dict[key];
    });

    document.querySelectorAll("[data-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-placeholder");
      const dict = window.TRANSLATIONS[lang] || window.TRANSLATIONS["ru"] || {};
      if (dict[key]) el.placeholder = dict[key];
    });
  };

  applyLang(savedLang);

  langSelect.addEventListener("change", () => {
    const lang = langSelect.value;
    localStorage.setItem("lang", lang);
    applyLang(lang);
  });
}

// ============================================================
// SLK ENDPOINT (URL ДЛЯ ОТПРАВКИ JSON)
// ============================================================
const SLK_ENDPOINT = ""; // например: "https://slk.goodoo.kg/api/demir-pos-form"

// ============================================================
// HELPERS
// ============================================================
function getFieldValue(id) {
  const el = document.getElementById(id);
  return el ? (el.value || "").trim() : "";
}

function collectFormData() {
  const data = {
    company: {
      name: getFieldValue("companyName"),
      bin: getFieldValue("companyBin"),
      head: getFieldValue("companyHead"),
      manager: getFieldValue("manager"),
      description: getFieldValue("description"),
    },
    contacts: {
      phone: getFieldValue("phone"),
      email: getFieldValue("email"),
    },
    pos: {
      model: getFieldValue("posModel"),
      commissions: {
        comm_visa_dkb: getFieldValue("comm_visa_dkb"),
        comm_bonus_dkb: getFieldValue("comm_bonus_dkb"),
        comm_visa_other: getFieldValue("comm_visa_other"),
        comm_elcart_dkb: getFieldValue("comm_elcart_dkb"),
        comm_elcart_other: getFieldValue("comm_elcart_other"),
        comm_mc_dkb: getFieldValue("comm_mc_dkb"),
        comm_mc_other: getFieldValue("comm_mc_other"),
      },
      discount_10: getFieldValue("discount_10"),
    },
    region: {
      district: getFieldValue("district"),
      ugnsCode: getFieldValue("ugnsCode"),
      legalAddress: getFieldValue("legalAddress"),
      legalLat: getFieldValue("legalLat"),
      legalLon: getFieldValue("legalLon"),
      tradeAddress: getFieldValue("tradeAddress"),
      tradeLat: getFieldValue("tradeLat"),
      tradeLon: getFieldValue("tradeLon"),
    },
    business: {
      objectType: getFieldValue("businessObjectType"),
      activityType: getFieldValue("activityType"),
    },
    signature: getFieldValue("signatureData"),
    meta: {
      createdAt: new Date().toISOString(),
      userAgent: navigator.userAgent,
    },
  };

  return data;
}

async function sendToSLK(payload) {
  if (!SLK_ENDPOINT) {
    console.log("JSON для SLK (SLK_ENDPOINT не настроен):", payload);
    return;
  }

  try {
    const res = await fetch(SLK_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.error("Ошибка отправки в SLK:", res.status, await res.text());
    } else {
      console.log("Успешно отправлено в SLK");
    }
  } catch (e) {
    console.error("Сетевая ошибка отправки в SLK:", e);
  }
}

// ============================================================
// SIGNATURE PAD (canvas → hidden input → img в PDF)
// ============================================================
function initSignaturePad() {
  const canvas = document.getElementById("signaturePad");
  const clearBtn = document.getElementById("signatureClear");
  const hiddenInput = document.getElementById("signatureData");

  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let drawing = false;
  let lastX = 0;
  let lastY = 0;

  function startDraw(x, y) {
    drawing = true;
    lastX = x;
    lastY = y;
  }

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
    const pdfImg = document.getElementById("pdf_signature");
    if (pdfImg) pdfImg.src = dataURL;
  }

  // Мышь
  canvas.addEventListener("mousedown", (e) => {
    const rect = canvas.getBoundingClientRect();
    startDraw(e.clientX - rect.left, e.clientY - rect.top);
  });
  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    drawLine(e.clientX - rect.left, e.clientY - rect.top);
  });
  window.addEventListener("mouseup", stopDraw);

  // Тач
  canvas.addEventListener("touchstart", (e) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const t = e.touches[0];
    startDraw(t.clientX - rect.left, t.clientY - rect.top);
  });
  canvas.addEventListener("touchmove", (e) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const t = e.touches[0];
    drawLine(t.clientX - rect.left, t.clientY - rect.top);
  });
  canvas.addEventListener("touchend", (e) => {
    e.preventDefault();
    stopDraw();
  });

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (hiddenInput) hiddenInput.value = "";
      const pdfImg = document.getElementById("pdf_signature");
      if (pdfImg) pdfImg.removeAttribute("src");
    });
  }
}

// ============================================================
// LEAFLET MAPS (минимальная инициализация, если нужен клик → координаты)
// ============================================================
function initMaps() {
  if (typeof L === "undefined") return; // Leaflet не загружен

  const legalMapEl = document.getElementById("legalMap");
  const tradeMapEl = document.getElementById("tradeMap");

  const defaultCenter = [42.8746, 74.5698]; // Бишкек

  if (legalMapEl) {
    const map = L.map(legalMapEl).setView(defaultCenter, 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);

    let marker;
    map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      if (marker) marker.setLatLng(e.latlng);
      else marker = L.marker(e.latlng).addTo(map);

      const latInput = document.getElementById("legalLat");
      const lonInput = document.getElementById("legalLon");
      if (latInput) latInput.value = lat.toFixed(6);
      if (lonInput) lonInput.value = lng.toFixed(6);
    });
  }

  if (tradeMapEl) {
    const map = L.map(tradeMapEl).setView(defaultCenter, 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);

    let marker;
    map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      if (marker) marker.setLatLng(e.latlng);
      else marker = L.marker(e.latlng).addTo(map);

      const latInput = document.getElementById("tradeLat");
      const lonInput = document.getElementById("tradeLon");
      if (latInput) latInput.value = lat.toFixed(6);
      if (lonInput) lonInput.value = lng.toFixed(6);
    });
  }
}

// ============================================================
// PDF EXPORT — FILL TEMPLATE
// ============================================================
function fillPdfTemplate() {
  // Простые пары "input ID" → "PDF ID"
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
  ];

  pairs.forEach(([srcId, destId]) => {
    const src = document.getElementById(srcId);
    const dest = document.getElementById(destId);
    if (!dest) return;
    const value = src ? (src.value || src.textContent || "").trim() : "";
    if (dest.tagName === "INPUT" || dest.tagName === "TEXTAREA") {
      dest.value = value;
    } else {
      dest.textContent = value;
    }
  });

  // Район + УГНС в одну строку
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

  // Скидки
  const discount10 = document.getElementById("discount_10");
  const pdfDiscount10 = document.getElementById("pdf_discount_10");
  if (pdfDiscount10) {
    const v = discount10 ? (discount10.value || "").trim() : "";
    pdfDiscount10.textContent = v ? v.replace(".", ",") : "";
  }

  // Дата заявки → pdf_date (если хочешь брать из поля applicationDate)
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

  // Подпись в PDF (если уже есть в hiddenInput)
  const sigData = getFieldValue("signatureData");
  const pdfSigImg = document.getElementById("pdf_signature");
  if (pdfSigImg && sigData) {
    pdfSigImg.src = sigData;
  }
}

// ============================================================
// PDF EXPORT — CLICK HANDLER (через window.print)
// ============================================================
function initPdfExport() {
  const btn = document.getElementById("savePdf");
  if (!btn) return;

  btn.addEventListener("click", async () => {
    // 1) Собираем JSON и логируем/отправляем в SLK
    const payload = collectFormData();
    await sendToSLK(payload);

    // 2) Заполняем PDF-шаблон данными формы
    fillPdfTemplate();

    // 3) Открываем диалог печати браузера
    //    (в нём выбираешь "Сохранить как PDF")
    window.print();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initSignaturePad();
  initMaps();
  initPdfExport(); // <-- не забыть вызвать
});

// ============================================================
// INIT
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  initSignaturePad();
  initMaps();
  initPdfExport();
});
