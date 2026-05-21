/* DOCX export module. PDF is intentionally not used here. */
(function () {
  const POS_TEMPLATE_URL = "templates/pos_application_template.docx";
  const KKM_TEMPLATE_URL = "templates/kkm_application_template.docx";

  const LIBS = [
    "https://cdnjs.cloudflare.com/ajax/libs/pizzip/3.1.7/pizzip.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/docxtemplater/3.48.0/docxtemplater.js"
  ];

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src=\"${src}\"]`)) return resolve();
      const script = document.createElement("script");
      script.src = src;
      script.onload = resolve;
      script.onerror = () => reject(new Error(`Library load failed: ${src}`));
      document.head.appendChild(script);
    });
  }

  async function ensureLibraries() {
    for (const src of LIBS) await loadScript(src);
    if (!window.PizZip || !window.docxtemplater) {
      throw new Error("DOCX libraries are not available");
    }
  }

  async function loadTemplate(url) {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error(`Template not found: ${url}`);
    return await response.arrayBuffer();
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }

  function valueById(id) {
    const el = document.getElementById(id);
    if (!el) return "";
    if (el.tagName === "SELECT") return el.options[el.selectedIndex]?.text?.trim() || "";
    return (el.value || el.textContent || "").trim();
  }

  function valueByName(name) {
    const el = document.querySelector(`[name=\"${name}\"]`);
    return el ? (el.value || "").trim() : "";
  }

  function checked(name, value) {
    return Boolean(document.querySelector(`input[name=\"${name}\"][value=\"${value}\"]:checked`));
  }

  function mark(name, value) {
    return checked(name, value) ? "✓" : "";
  }

  function selectText(id) {
    const el = document.getElementById(id);
    if (!el || el.tagName !== "SELECT") return "";
    const text = el.options[el.selectedIndex]?.text?.trim() || "";
    return text.startsWith("—") ? "" : text;
  }

  function formatDate(value) {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    const months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
    const day = String(date.getDate()).padStart(2, "0");
    return `«${day}» ${months[date.getMonth()]} ${date.getFullYear()} г.`;
  }

  function datePart(value, part) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    const months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
    if (part === "day") return String(date.getDate()).padStart(2, "0");
    if (part === "month") return months[date.getMonth()];
    if (part === "year") return String(date.getFullYear());
    return "";
  }

  function collectDocxData() {
    const contractDate = valueByName("contractDate");
    const applicationDate = valueByName("applicationDate");
    const district = selectText("district");
    const ugns = valueById("ugnsCode");
    const branch = selectText("responsibleBranches");
    const vatStatus = selectText("vatStatus");
    const tradeLat = valueById("tradeLat");
    const tradeLon = valueById("tradeLon");

    return {
      requestNewMark: mark("requestType", "new"),
      requestReplaceMark: mark("requestType", "replace"),
      requestUpdateDataMark: mark("requestType", "updateData"),
      requestQrMark: mark("requestType", "qr"),
      terminalWithKkmMark: mark("terminalType", "withKKM"),
      terminalWithoutKkmMark: mark("terminalType", "withoutKKM"),
      contractNumber: valueByName("contractNumber"),
      contractDay: datePart(contractDate, "day"),
      contractMonth: datePart(contractDate, "month"),
      contractYear: datePart(contractDate, "year"),
      applicationNumber: valueByName("applicationNumber"),
      applicationDateText: formatDate(applicationDate),
      cardVisaMark: mark("cardTypes", "Visa"),
      cardMasterCardMark: mark("cardTypes", "MasterCard"),
      cardElkartMark: mark("cardTypes", "Elkart"),
      cardUnionPayMark: "",
      companyName: valueById("companyName"),
      companyLegalName: valueById("companyName"),
      companyBin: valueById("companyBin"),
      companyHead: valueById("companyHead"),
      companyHeadInn: valueById("companyHeadInn"),
      manager: valueById("manager"),
      responsiblePerson: valueById("manager"),
      phone: valueById("phone"),
      mobilePhone: valueById("mobilePhone"),
      email: valueById("email"),
      legalAddress: valueById("legalAddress"),
      legalCity: valueById("legalAddress"),
      legalStreet: valueById("legalAddress"),
      tradeAddress: valueById("tradeAddress"),
      tradeLat,
      tradeLon,
      postalCoords: [valueById("postalCode"), tradeLat, tradeLon].filter(Boolean).join(", "),
      districtUgns: [district, ugns].filter(Boolean).join(" / "),
      taxAuthority: [district, ugns].filter(Boolean).join(" / "),
      businessObjectType: selectText("businessObjectType"),
      activityType: selectText("activityType"),
      accountNumber: valueByName("accountNumber"),
      responsibleBranch: branch,
      accountOpeningBranch: branch,
      posModel: selectText("posModel"),
      posCount: "1",
      companyFoundationDate: "",
      workFrom: valueByName("workFrom"),
      workTo: valueByName("workTo"),
      bankSigner: "",
      executor: "",
      objectName: valueById("objectName") || valueById("companyName"),
      vatStatus,
      taxRates: vatStatus,
      paymentSubject: selectText("paymentSubject"),
      kkmReason: valueById("kkmReason"),
      lkCreds: [valueById("lkLogin"), valueById("lkPassword")].filter(Boolean).join(" / "),
      comm_visa_dkb: valueById("comm_visa_dkb"),
      comm_bonus_dkb: valueById("comm_bonus_dkb"),
      comm_visa_other: valueById("comm_visa_other"),
      comm_elcart_dkb: valueById("comm_elcart_dkb"),
      comm_elcart_other: valueById("comm_elcart_other"),
      comm_mc_dkb: valueById("comm_mc_dkb"),
      comm_mc_other: valueById("comm_mc_other"),
      comm_unionpay_dkb: "",
      disc_visa_electron: "",
      disc_visa_classic: "",
      disc_visa_gold: "",
      disc_visa_business: "",
      disc_visa_platinum: "",
      disc_maestro: "",
      disc_mc_standard: "",
      disc_mc_gold: "",
      disc_mc_platinum: "",
      disc_elcart: valueById("discount_10")
    };
  }

  async function renderDocx(templateUrl, data, filename) {
    const template = await loadTemplate(templateUrl);
    const zip = new window.PizZip(template);
    const doc = new window.docxtemplater(zip, { paragraphLoop: true, linebreaks: true, nullGetter: () => "" });
    doc.render(data);
    const blob = doc.getZip().generate({ type: "blob", mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
    downloadBlob(blob, filename);
  }

  async function exportDocxForms() {
    await ensureLibraries();
    const data = collectDocxData();
    const suffix = data.applicationNumber || "без_номера";
    await renderDocx(POS_TEMPLATE_URL, data, `Заявка_на_регистрацию_пункта_обслуживания_${suffix}.docx`);
    await renderDocx(KKM_TEMPLATE_URL, data, `Заявление_о_регистрации_ККМ_${suffix}.docx`);
  }

  function initDocxButton() {
    const oldButton = document.getElementById("savePdf");
    if (!oldButton) return;
    const button = oldButton.cloneNode(true);
    button.textContent = "Скачать DOCX";
    oldButton.parentNode.replaceChild(button, oldButton);
    button.addEventListener("click", async () => {
      try {
        await exportDocxForms();
      } catch (error) {
        console.error(error);
        alert("Не удалось сформировать DOCX. Проверьте наличие шаблонов в папке templates.");
      }
    });
  }

  window.addEventListener("DOMContentLoaded", () => setTimeout(initDocxButton, 500));
})();
