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

/* DOCX-first mode. HTML print remains legacy; primary output is DOCX templates. */
window.addEventListener("DOMContentLoaded", () => {
  const removeFieldByInputId = (id) => {
    const input = document.getElementById(id);
    const wrapper = input?.closest(".field");
    if (wrapper) wrapper.remove();
  };

  ["kkmSerialNumber", "kkmVersion", "kkmModel", "kkmRnm", "kkmFn", "taxRates"].forEach(removeFieldByInputId);
  ["kkmSerialNumber", "kkmVersion", "kkmModel", "kkmRnm", "kkmFn", "taxRates"].forEach((id) => localStorage.removeItem(id));

  const oldButton = document.getElementById("savePdf");
  if (oldButton) {
    oldButton.textContent = "Скачать DOCX";
  }

  const script = document.createElement("script");
  script.src = "docx-export.js?v=1";
  script.defer = true;
  document.head.appendChild(script);
});
