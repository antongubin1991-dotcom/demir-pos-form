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
  document.querySelectorAll("[data-key]").forEach((el) => {
    const key = el.getAttribute("data-key");
    const tr = translations[lang]?.[key];
    if (!tr) return;

    // Оставляем карту без изменений
    if (el.classList.contains("no-translate")) return;

    // Не перезаписываем INPUT/TEXTAREA
    if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") return;

    el.textContent = tr;
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
  const lang = langSelect.value;
  applyTranslations(lang);
});


/* ============================================================
   AUTO-SAVE FORM FIELDS
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
   POPULATE BUSINESS DROPDOWNS
============================================================ */
if (window.businessObjects && window.activityTypes) {
  const businessObjectType = document.getElementById("businessObjectType");
  const activityType = document.getElementById("activityType");

  businessObjects.forEach((v) => {
    const opt = document.createElement("option");
    opt.textContent = v;
    opt.value = v;
    businessObjectType.appendChild(opt);
  });

  activityTypes.forEach((v) => {
    const opt = document.createElement("option");
    opt.textContent = v;
    opt.value = v;
    activityType.appendChild(opt);
  });
}


/* ============================================================
   POS MODEL SELECT
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
   LEAFLET MAPS + REVERSE GEOCODING
============================================================ */

function initMap(mapId, addressInputId, latInputId, lonInputId) {
    const defaultLat = 42.8746;
    const defaultLon = 74.5698;

    const map = L.map(mapId).setView([defaultLat, defaultLon], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap"
    }).addTo(map);

    const marker = L.marker([defaultLat, defaultLon], { draggable: true }).addTo(map);

    function updateFields(lat, lon) {
        document.getElementById(latInputId).value = lat.toFixed(6);
        document.getElementById(lonInputId).value = lon.toFixed(6);

        localStorage.setItem(latInputId, lat.toFixed(6));
        localStorage.setItem(lonInputId, lon.toFixed(6));

        // Reverse geocoding — текстовый адрес
        fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=ru`
        )
            .then(r => r.json())
            .then(data => {
                if (data && data.display_name) {
                    document.getElementById(addressInputId).value = data.display_name;
                    localStorage.setItem(addressInputId, data.display_name);
                }
            })
            .catch(() => {});
    }

    // Drag marker
    marker.on("dragend", (e) => {
        const pos = e.target.getLatLng();
        updateFields(pos.lat, pos.lng);
    });

    // Click on map
    map.on("click", (e) => {
        marker.setLatLng(e.latlng);
        updateFields(e.latlng.lat, e.latlng.lng);
    });

    // Restore saved coordinates or initialize
    const savedLat = localStorage.getItem(latInputId);
    const savedLon = localStorage.getItem(lonInputId);

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
