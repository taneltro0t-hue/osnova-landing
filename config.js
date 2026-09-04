// Production-интеграции посадочной. На localhost и *.github.io аналитика и отправка формы не активируются.
window.OSNOVA_LANDING_CONFIG = {
  // Счётчик Яндекс Метрики рекламной посадочной stavropol-stopzavisimost.ru.
  // Цели создаются как «JavaScript-событие» с идентификаторами:
  // form_success (основная), phone_click, form_start, scenario_select, call_prompt_open, faq_open, callback_scroll, form_error.
  metrikaCounterId: 103396251,
  // URL приёма заявки: POST multipart/form-data
  // (phone, contact_time, case, utm_source, utm_medium, utm_campaign, utm_content, utm_term, yclid, landing_url, referrer), ответ 2xx.
  // Пока пусто: на production форма покажет телефон вместо отправки.
  formEndpoint: ""
};
