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
   KKM FORM CLEANUP
   - Модель ККМ больше не используется.
   - Заводской № / версия / РНМ / ФН остаются в форме, но не являются обязательными.
   - Комментарий не является обязательным при печати.
============================================================ */
window.addEventListener("DOMContentLoaded", () => {
  const removeKkmModel = () => {
    const kkmModelInput = document.getElementById("kkmModel");
    const kkmModelField = kkmModelInput?.closest(".field");
    if (kkmModelField) kkmModelField.remove();

    const kkmModelPdfCell = document.getElementById("kkm_kkmModel");
    const kkmModelPdfRow = kkmModelPdfCell?.closest("tr");
    if (kkmModelPdfRow) kkmModelPdfRow.remove();

    localStorage.removeItem("kkmModel");
  };

  removeKkmModel();

  const patchValidation = () => {
    if (typeof window.validatePdfRequiredFields !== "function") return;

    const originalValidatePdfRequiredFields = window.validatePdfRequiredFields;

    window.validatePdfRequiredFields = function validatePdfRequiredFieldsWithoutRequiredComment() {
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

  setTimeout(patchValidation, 0);
});
