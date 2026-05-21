# DOCX-шаблоны

Этот каталог используется режимом DOCX-first.

Нужно положить сюда два файла:

```text
pos_application_template.docx
kkm_application_template.docx
```

## POS-шаблон

Файл должен быть основан на банковской форме:

```text
Заявка на установку пос-терминала Новый (002).docx
```

## ККМ-шаблон

Файл должен быть основан на форме:

```text
Шаблон заявления.docx
```

## Используемые плейсхолдеры

В шаблонах используются переменные формата:

```text
{{companyName}}
{{companyBin}}
{{contractNumber}}
{{applicationNumber}}
{{tradeAddress}}
{{legalAddress}}
```

Полный список переменных находится в `docx-export.js`, функция `collectDocxData()`.

PDF пока не используется.
