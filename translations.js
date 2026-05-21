window.translations = {
  ru: {
    title: "Анкета Demir POS",

    sec_business: "Вид деятельности",
    sec_company: "Данные компании",
    sec_contacts: "Контакты",
    sec_pos: "POS-терминал и условия",
    sec_address_legal: "Юридический адрес",
    sec_address_trade: "Адрес торговой точки",

    sec_request: "Тип заявки и договор",
    sec_cards: "Типы карточек",
    sec_bank: "Банковские реквизиты",
    sec_comment: "Комментарий",

    lbl_business_object: "Тип объекта предпринимательства",
    lbl_activity_type: "Вид деятельности",
    legal_address: "Юридический адрес",
    trade_address: "Адрес торговой точки",
    description: "Комментарий"
  },

  kg: {
    title: "Demir POS анкета",

    sec_business: "Иштин түрү",
    sec_company: "Компания маалыматы",
    sec_contacts: "Байланыш маалыматтары",
    sec_pos: "POS терминалы жана шарттары",
    sec_address_legal: "Юридикалык дарек",
    sec_address_trade: "Соода чекитинин дареги",

    sec_request: "Өтүнмө тиби жана келишим",
    sec_cards: "Карта түрлөрү",
    sec_bank: "Банк реквизиттери",
    sec_comment: "Комментарий",

    lbl_business_object: "Ишкердик объектинин тиби",
    lbl_activity_type: "Ишмердүүлүктүн түрү",
    legal_address: "Юридикалык дарек",
    trade_address: "Соода чекитинин дареги",
    description: "Комментарий"
  },

  en: {
    title: "Demir POS Application Form",

    sec_business: "Business Category",
    sec_company: "Company Details",
    sec_contacts: "Contacts",
    sec_pos: "POS Terminal & Terms",
    sec_address_legal: "Legal Address",
    sec_address_trade: "Store Location",

    sec_request: "Application Type & Contract",
    sec_cards: "Card Types",
    sec_bank: "Bank Details",
    sec_comment: "Comment",

    lbl_business_object: "Business Object Type",
    lbl_activity_type: "Activity Type",
    legal_address: "Legal address",
    trade_address: "Store address",
    description: "Comment"
  }
};

/* ============================================================
   PRIMARY APPLICATION MODE
============================================================ */
window.addEventListener("DOMContentLoaded", () => {
  const vatLabels = {
    vat: "Плательщик НДС",
    singleTax: "Единый налог",
    simplified: "Упрощённая система",
    patent: "Патент",
    none: "Без регистрации НДС"
  };

  const removeFieldByInputId = (id) => {
    const input = document.getElementById(id);
    const wrapper = input?.closest(".field");
    if (wrapper) wrapper.remove();
  };

  const removePosSensitiveBlocks = (root = document) => {
    const loginCell = root.querySelector("#pdf_lkLogin");
    const loginFlex = loginCell?.parentElement?.parentElement;
    const loginTitle = loginFlex?.previousElementSibling;
    if (loginTitle && loginTitle.textContent.includes("Логин/пароль")) {
      loginTitle.remove();
    }
    if (loginFlex) loginFlex.remove();

    const commentBlock = root.querySelector("#pdf_description");
    const commentTitle = commentBlock?.previousElementSibling;
    if (commentTitle && commentTitle.textContent.includes("Комментарий")) {
      commentTitle.remove();
    }
    if (commentBlock) commentBlock.remove();
  };

  ["kkmSerialNumber", "kkmVersion", "kkmModel", "kkmRnm", "kkmFn"].forEach(removeFieldByInputId);

  const taxRatesInput = document.getElementById("taxRates");
  const taxRatesWrapper = taxRatesInput?.closest(".field");
  if (taxRatesWrapper) taxRatesWrapper.remove();

  let hiddenTaxRates = document.getElementById("taxRates");
  if (!hiddenTaxRates) {
    hiddenTaxRates = document.createElement("input");
    hiddenTaxRates.type = "hidden";
    hiddenTaxRates.id = "taxRates";
    document.body.appendChild(hiddenTaxRates);
  }

  const syncTaxRatesFromVatStatus = () => {
    const vatStatus = document.getElementById("vatStatus")?.value || "";
    hiddenTaxRates.value = vatLabels[vatStatus] || "";
  };

  const vatStatusSelect = document.getElementById("vatStatus");
  if (vatStatusSelect) {
    vatStatusSelect.addEventListener("change", syncTaxRatesFromVatStatus);
    vatStatusSelect.addEventListener("input", syncTaxRatesFromVatStatus);
  }
  syncTaxRatesFromVatStatus();

  [
    "kkm_serialAndVersion",
    "kkm_kkmModel",
    "kkm_rnm",
    "kkm_fn"
  ].forEach((id) => {
    const cell = document.getElementById(id);
    const row = cell?.closest("tr");
    if (row) row.remove();
  });

  const renumber = [
    ["kkm_reason", "15) Причина перерегистрации и снятия"],
    ["kkm_email", "16) Электронная почта"],
    ["kkm_postalAndCoords", "17) Почтовый индекс, широта и долгота"],
    ["kkm_lkCreds", "18) Логин и пароль от lk.salyk.kg"]
  ];

  renumber.forEach(([cellId, label]) => {
    const row = document.getElementById(cellId)?.closest("tr");
    const labelCell = row?.querySelector("td:first-child");
    if (labelCell) labelCell.textContent = label;
  });

  ["kkmSerialNumber", "kkmVersion", "kkmModel", "kkmRnm", "kkmFn", "taxRates"].forEach((id) => {
    localStorage.removeItem(id);
  });

  removePosSensitiveBlocks(document);

  const patchValidation = () => {
    if (typeof window.validatePdfRequiredFields !== "function") return;

    const originalValidatePdfRequiredFields = window.validatePdfRequiredFields;

    window.validatePdfRequiredFields = function validatePdfRequiredFieldsWithoutRequiredComment() {
      syncTaxRatesFromVatStatus();

      const description = document.getElementById("description");
      const originalDescriptionValue = description ? description.value : "";

      if (description && !description.value.trim()) {
        description.value = "Комментарий не указан";
      }

      const isValid = originalValidatePdfRequiredFields();

      if (description) {
        description.value = originalDescriptionValue;
        description.classList.remove("field-error");
      }

      return isValid;
    };
  };

  const patchKkmTemplateFill = () => {
    if (typeof window.fillKkmTemplateForPrint !== "function") return;

    const originalFillKkmTemplateForPrint = window.fillKkmTemplateForPrint;

    window.fillKkmTemplateForPrint = function fillKkmTemplateForPrintWithVatTaxRates() {
      syncTaxRatesFromVatStatus();
      originalFillKkmTemplateForPrint();
      const taxRatesCell = document.getElementById("kkm_taxRates");
      if (taxRatesCell) {
        taxRatesCell.textContent = hiddenTaxRates.value;
      }
    };
  };

  const openScaledPrintWindow = (templateId, title) => {
    const tpl = document.getElementById(templateId);
    if (!tpl) {
      alert("Шаблон " + templateId + " не найден!");
      return null;
    }

    const isPosDocument = templateId === "pdfDocument";
    const scale = isPosDocument ? 0.58 : 0.78;
    const width = isPosDocument ? 800 : 800;

    const win = window.open("", "_blank");
    if (!win) {
      alert("Разрешите всплывающие окна для печати.");
      return null;
    }

    win.document.write(`
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${title}</title>
          <style>
            @page { size: A4 portrait; margin: 3mm; }
            html, body {
              margin: 0;
              padding: 0;
              background: #fff;
              color: #000;
              font-family: 'Times New Roman', serif;
            }
            .print-scale {
              width: ${width}px;
              zoom: ${scale};
              transform: none !important;
              transform-origin: top left;
            }
            table { page-break-inside: avoid; }
            tr { page-break-inside: avoid; }
            .pdf-signature-block { margin-bottom: 0 !important; }
          </style>
        </head>
        <body></body>
      </html>
    `);
    win.document.close();

    const clone = tpl.cloneNode(true);
    if (isPosDocument) removePosSensitiveBlocks(clone);
    clone.style.display = "block";
    clone.style.margin = "0";
    clone.style.padding = isPosDocument ? "4px" : "14px";
    clone.style.minHeight = "auto";
    clone.style.height = "auto";
    clone.style.lineHeight = isPosDocument ? "1.04" : "1.25";
    clone.style.fontSize = isPosDocument ? "10pt" : "12pt";
    clone.style.zoom = String(scale);
    clone.style.transform = "none";
    clone.classList.add("print-scale");

    if (isPosDocument) {
      clone.querySelectorAll("h3").forEach((el) => {
        el.style.margin = "3px 0 2px 0";
        el.style.fontSize = "10.5pt";
      });
      clone.querySelectorAll("table").forEach((el) => {
        el.style.marginBottom = "3px";
        el.style.fontSize = "9.5pt";
      });
      clone.querySelectorAll("td, th").forEach((el) => {
        el.style.padding = "1px 2px";
      });
      clone.querySelectorAll("p").forEach((el) => {
        el.style.margin = "2px 0 3px 0";
      });
      clone.querySelectorAll("div").forEach((el) => {
        if (el.style.marginBottom) el.style.marginBottom = "3px";
        if (el.style.marginTop) el.style.marginTop = "3px";
      });
    }

    win.document.body.appendChild(clone);

    return win;
  };

  const patchPrintButton = () => {
    const oldBtn = document.getElementById("savePdf");
    if (!oldBtn) return;

    const newBtn = oldBtn.cloneNode(true);
    oldBtn.parentNode.replaceChild(newBtn, oldBtn);

    newBtn.addEventListener("click", async () => {
      if (typeof window.validatePdfRequiredFields === "function" && !window.validatePdfRequiredFields()) return;

      try {
        if (typeof window.collectFormDataForSLK === "function") {
          const slkPayload = window.collectFormDataForSLK();
          console.log("SLK JSON (отправка отключена):", JSON.stringify(slkPayload, null, 2));
        }
      } catch (e) {
        console.warn("Не удалось собрать SLK JSON:", e);
      }

      if (typeof window.fillPdfTemplateForPrint === "function") {
        window.fillPdfTemplateForPrint();
      }
      if (typeof window.fillKkmTemplateForPrint === "function") {
        window.fillKkmTemplateForPrint();
      }

      const posWin = openScaledPrintWindow("pdfDocument", "Заявка на регистрацию пункта обслуживания");
      const kkmWin = openScaledPrintWindow("kkmDocument", "Заявление о регистрации ККМ");
      if (!posWin) return;

      setTimeout(() => {
        posWin.focus();
        posWin.print();
        posWin.close();

        if (!kkmWin) return;
        setTimeout(() => {
          kkmWin.focus();
          kkmWin.print();
          kkmWin.close();
        }, 700);
      }, 400);
    });
  };

  setTimeout(() => {
    patchValidation();
    patchKkmTemplateFill();
    patchPrintButton();
  }, 0);
});
