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
   LANGUAGE SWITCH
============================================================ */
const langSelect = document.getElementById("langSelect");
const savedLang = localStorage.getItem("lang") || "ru";
langSelect.value = savedLang;

function applyTranslations(lang) {
  // Replace text in elements with data-key
  document.querySelectorAll("[data-key]").forEach((el) => {
    const key = el.getAttribute("data-key");
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });

  // Replace placeholders
  document.querySelectorAll("[data-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-placeholder");
    if (translations[lang] && translations[lang][key]) {
      el.placeholder = translations[lang][key];
    }
  });

  localStorage.setItem("lang", lang);
}

applyTranslations(savedLang);

langSelect.addEventListener("change", () => {
  const lang = langSelect.value;
  applyTranslations(lang);
});


/* ============================================================
   AUTO-SAVE FORM FIELDS
============================================================ */
const fields = [
  "companyName", "companyBin", "companyHead",
  "phone", "email", "manager",
  "legalAddress", "tradeAddress",
  "businessObjectType", "activityType",
  "posModel", "description"
];

fields.forEach((id) => {
  const el = document.getElementById(id);
  if (!el) return;

  // Load saved
  const saved = localStorage.getItem(id);
  if (saved) el.value = saved;

  // Save on change
  el.addEventListener("input", () => {
    localStorage.setItem(id, el.value);
  });
});


/* ============================================================
   POS MODEL SELECT (WITH KOZEN)
============================================================ */
const posModel = document.getElementById("posModel");
if (posModel) {
  const savedModel = localStorage.getItem("posModel");
  if (savedModel) posModel.value = savedModel;

  posModel.addEventListener("change", () => {
    localStorage.setItem("posModel", posModel.value);
  });
}


/* ============================================================
   LEAFLET MAP INITIALIZATION
============================================================ */
let legalMap, tradeMap;
let legalMarker = null;
let tradeMarker = null;

function initMaps() {
  /* ---------- LEGAL ADDRESS MAP ---------- */
  const legalDiv = document.getElementById("legalMap");

  if (legalDiv) {
    legalMap = L.map("legalMap").setView([42.8746, 74.5698], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19
    }).addTo(legalMap);

    // Restore saved marker
    const savedLegal = localStorage.getItem("legalAddress");
    if (savedLegal && savedLegal.includes(",")) {
      const [lat, lng] = savedLegal.split(",").map(Number);
      legalMarker = L.marker([lat, lng]).addTo(legalMap);
      legalMap.setView([lat, lng], 15);
    }

    legalMap.on("click", (e) => {
      const { lat, lng } = e.latlng;

      document.getElementById("legalAddress").value =
        `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      localStorage.setItem("legalAddress", `${lat},${lng}`);

      if (legalMarker) legalMarker.remove();
      legalMarker = L.marker([lat, lng]).addTo(legalMap);
    });
  }


  /* ---------- TRADE ADDRESS MAP ---------- */
  const tradeDiv = document.getElementById("tradeMap");

  if (tradeDiv) {
    tradeMap = L.map("tradeMap").setView([42.8746, 74.5698], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19
    }).addTo(tradeMap);

    const savedTrade = localStorage.getItem("tradeAddress");
    if (savedTrade && savedTrade.includes(",")) {
      const [lat, lng] = savedTrade.split(",").map(Number);
      tradeMarker = L.marker([lat, lng]).addTo(tradeMap);
      tradeMap.setView([lat, lng], 15);
    }

    tradeMap.on("click", (e) => {
      const { lat, lng } = e.latlng;

      document.getElementById("tradeAddress").value =
        `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      localStorage.setItem("tradeAddress", `${lat},${lng}`);

      if (tradeMarker) tradeMarker.remove();
      tradeMarker = L.marker([lat, lng]).addTo(tradeMap);
    });
  }
}

document.addEventListener("DOMContentLoaded", initMaps);


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
   TABLES — AUTO SAVE
============================================================ */
document.querySelectorAll(".tbl input").forEach((input) => {
  const id = input.id;
  const saved = localStorage.getItem(id);

  if (saved) input.value = saved;

  input.addEventListener("input", () => {
    localStorage.setItem(id, input.value);
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

    const words = el.value.split(/\s+/);

    words.forEach((w) => {
      if (w.length > 5 && Math.random() < 0.03) {
        const div = document.createElement("div");
        div.textContent = `Возможная ошибка: «${w}»`;
        spellPanel.appendChild(div);
      }
    });
  });
}

setInterval(fakeSpellCheck, 2500);
