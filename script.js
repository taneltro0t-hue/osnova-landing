(() => {
  "use strict";

  const config = Object.assign({ formEndpoint: "", metrikaCounterId: 0 }, window.OSNOVA_LANDING_CONFIG || {});
  const PHONE = "+7 928 963-32-80";

  const scenarios = {
    family: {
      eyebrow: "Помощь семье при зависимости · Ставрополь",
      pageTitle: "Помощь семье при зависимости в Ставрополе | Реабилитационный центр ОСНОВА",
      title: "Обещает бросить.<br>И всё начинается снова.",
      lead: "Если уговоры и контроль не работают, позвоните. За один разговор разберём, что можно сделать сегодня, и честно скажем, чем можем помочь, а чем нет.",
      visualKicker: "Помощь родственнику",
      visualTitle: "Можно начать с разговора без него.",
      callCopy: "Расскажите, что происходит дома. Вместе определим ближайший безопасный шаг.",
      finalEyebrow: "Можно начать без него",
      finalTitle: "Не ждите идеального момента для разговора",
      finalLead: "Позвоните сами. Даже если близкий пока отказывается признавать проблему."
    },
    alcohol: {
      eyebrow: "Реабилитация при алкогольной зависимости · Ставрополь",
      pageTitle: "Реабилитация при алкоголизме в Ставрополе | Реабилитационный центр ОСНОВА",
      title: "Запой заканчивается.<br>И всё начинается снова.",
      lead: "Если трезвые паузы становятся всё короче, позвоните. Разберём ситуацию без осуждения и скажем честно, с какого этапа начинать.",
      visualKicker: "Алкогольная зависимость",
      visualTitle: "Запой закончился. Но круг может начаться снова.",
      callCopy: "Расскажите, когда закончился последний запой и что происходит сейчас. Подскажем, с чего начинать.",
      finalEyebrow: "Пока длится трезвая пауза",
      finalTitle: "Самое время не ждать следующего запоя",
      finalLead: "Позвоните сейчас, пока есть окно для разговора. Можно без участия близкого."
    },
    drugs: {
      eyebrow: "Реабилитация наркозависимых · Ставрополь",
      pageTitle: "Реабилитация наркозависимых в Ставрополе | Реабилитационный центр ОСНОВА",
      title: "Говорит: «Я контролирую».<br>Вы видите обратное.",
      lead: "Если поведение меняется, деньги пропадают, а разговоры заканчиваются отрицанием, позвоните. Первый разговор возможен без него.",
      visualKicker: "Наркотическая зависимость",
      visualTitle: "Отрицание не отменяет того, что вы видите.",
      callCopy: "Опишите изменения, которые заметила семья. Первый разговор возможен без участия близкого.",
      finalEyebrow: "Можно начать без него",
      finalTitle: "Не ждите, пока станет хуже",
      finalLead: "Позвоните сами. Даже если близкий всё отрицает и отказывается говорить."
    },
    self: {
      eyebrow: "Реабилитационный центр «ОСНОВА» · Ставрополь",
      pageTitle: "Реабилитационный центр в Ставрополе | ОСНОВА",
      title: "Хотите остановиться,<br>но в одиночку не выходит?",
      lead: "Срывы повторяются, а обещания себе не держатся. Позвоните: разберём, с чего начать, и объясним, как проходит поступление. Без осуждения.",
      visualKicker: "Если вы ищете помощь для себя",
      visualTitle: "Один звонок ни к чему не обязывает.",
      callCopy: "Расскажите, что происходит и что уже пробовали. Объясним, как проходит поступление и что будет дальше.",
      finalEyebrow: "Можно начать сегодня",
      finalTitle: "Не ждите «понедельника»",
      finalLead: "Позвоните или оставьте номер. Расскажем, как проходит поступление и что входит в программу."
    }
  };

  const trackedKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "yclid"];
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));

  const storage = {
    get(k) { try { return window.sessionStorage.getItem(k); } catch (_e) { return null; } },
    set(k, v) { try { window.sessionStorage.setItem(k, v); } catch (_e) { /* private mode */ } }
  };

  function isPreviewHost() {
    const h = window.location.hostname;
    return ["localhost", "127.0.0.1", "::1", ""].includes(h) || h.endsWith("github.io");
  }

  function currentCase() { return document.body.dataset.case || "family"; }

  function track(eventName, payload = {}) {
    const data = Object.assign({ event: eventName, case: currentCase() }, payload);
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(data);
    if (config.metrikaCounterId && typeof window.ym === "function") {
      window.ym(config.metrikaCounterId, "reachGoal", eventName, data);
    }
  }

  function initMetrika() {
    if (!config.metrikaCounterId || isPreviewHost() || typeof window.ym === "function") return;
    (function (m, e, t, r, i, k, a) {
      m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments); };
      m[i].l = 1 * new Date();
      k = e.createElement(t); a = e.getElementsByTagName(t)[0];
      k.async = 1; k.src = r; a.parentNode.insertBefore(k, a);
    })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
    window.ym(config.metrikaCounterId, "init", { clickmap: true, trackLinks: true, accurateTrackBounce: true, webvisor: true });
    window.ym(config.metrikaCounterId, "params", { case: new URLSearchParams(window.location.search).get("case") || storage.get("osnova_case") || "family" });
  }

  function captureAttribution() {
    const params = new URLSearchParams(window.location.search);
    trackedKeys.forEach((k) => { const v = params.get(k); if (v) storage.set(`osnova_${k}`, v); });
    $$("form").forEach((form) => {
      trackedKeys.forEach((k) => {
        const field = form.elements.namedItem(k);
        if (field) field.value = params.get(k) || storage.get(`osnova_${k}`) || "";
      });
      const landing = form.elements.namedItem("landing_url");
      const referrer = form.elements.namedItem("referrer");
      if (landing) landing.value = window.location.href;
      if (referrer) referrer.value = document.referrer || "";
    });
  }

  function placeSituationVisual(scenario) {
    const layout = $(".situations-layout");
    const visual = $("[data-situation-visual]");
    const active = $(`[data-scenario="${scenario}"]`);
    if (!layout || !visual || !active) return;
    if (window.matchMedia("(max-width: 960px)").matches) {
      active.insertAdjacentElement("afterend", visual);
    } else if (visual.parentElement !== layout) {
      layout.append(visual);
    }
  }

  function setScenario(next, options = {}) {
    const scenario = scenarios[next] ? next : "family";
    const c = scenarios[scenario];
    document.body.dataset.case = scenario;
    document.title = c.pageTitle;
    const set = (sel, value, html = false) => { const el = $(sel); if (!el) return; if (html) el.innerHTML = value; else el.textContent = value; };
    set("[data-hero-eyebrow]", c.eyebrow);
    set("[data-hero-title]", c.title, true);
    set("[data-hero-lead]", c.lead);
    set("[data-situation-visual-kicker]", c.visualKicker);
    set("[data-situation-visual-title]", c.visualTitle);
    set("[data-call-dialog-copy]", c.callCopy);
    set("[data-final-eyebrow]", c.finalEyebrow);
    set("[data-final-title]", c.finalTitle);
    set("[data-final-lead]", c.finalLead);

    $$("[data-scenario]").forEach((b) => {
      const on = b.dataset.scenario === scenario;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-selected", String(on));
    });
    $$("[data-situation-image]").forEach((img) => img.classList.toggle("is-active", img.dataset.situationImage === scenario));
    $$("[data-case-input]").forEach((i) => { i.value = scenario; });
    placeSituationVisual(scenario);
    storage.set("osnova_case", scenario);

    if (options.updateUrl) {
      const url = new URL(window.location.href);
      url.searchParams.set("case", scenario);
      window.history.replaceState({}, "", url);
    }
    if (options.track) track("scenario_select");
  }

  function initScenarios() {
    const params = new URLSearchParams(window.location.search);
    const fromPath = (window.location.pathname.match(/\/(narkomaniya|alkogolizm|semya|sam)\/?$/) || [])[1];
    const pathMap = { narkomaniya: "drugs", alkogolizm: "alcohol", semya: "family", sam: "self" };
    setScenario(params.get("case") || pathMap[fromPath] || storage.get("osnova_case") || "family");
    $$("[data-scenario]").forEach((b) => b.addEventListener("click", () => setScenario(b.dataset.scenario, { updateUrl: true, track: true })));
    window.matchMedia("(max-width: 960px)").addEventListener("change", () => placeSituationVisual(currentCase()));
  }

  function initCallDialog() {
    const dialog = $("[data-call-dialog]");
    const open = $("[data-call-prompt-open]");
    if (!dialog || !open) return;
    open.addEventListener("click", () => {
      track("call_prompt_open");
      if (typeof dialog.showModal === "function") dialog.showModal();
      else window.location.href = "tel:+79289633280";
    });
    $$("[data-call-dialog-close]", dialog).forEach((b) => b.addEventListener("click", () => dialog.close()));
    dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });
  }

  function initPhoneTracking() {
    $$("[data-phone-link]").forEach((link) => {
      link.addEventListener("click", () => {
        const placement = link.closest("header") ? "header"
          : link.closest(".final-cta") ? "final"
          : link.closest(".mobile-callbar") ? "mobile_bar"
          : link.closest(".hero") ? "hero"
          : link.closest("dialog") ? "dialog"
          : "content";
        track("phone_click", { placement });
      });
    });
  }

  function normalizePhone(v) {
    const d = v.replace(/\D/g, "");
    if (d.length === 11 && (d.startsWith("7") || d.startsWith("8"))) return d.slice(1);
    return d.slice(0, 10);
  }
  function formatPhone(v) {
    const d = normalizePhone(v);
    if (!d) return "";
    let r = "+7";
    if (d.length > 0) r += ` ${d.slice(0, 3)}`;
    if (d.length >= 4) r += ` ${d.slice(3, 6)}`;
    if (d.length >= 7) r += `-${d.slice(6, 8)}`;
    if (d.length >= 9) r += `-${d.slice(8, 10)}`;
    return r;
  }
  function setStatus(form, msg, isError = false) {
    const s = $("[data-form-status]", form);
    if (!s) return;
    s.textContent = msg;
    s.classList.toggle("is-error", isError);
  }

  async function sendForm(form) {
    const phone = form.elements.namedItem("phone");
    const err = $("[data-phone-error]", form);
    const digits = normalizePhone(phone.value);
    phone.setAttribute("aria-invalid", String(digits.length !== 10));
    err.textContent = digits.length === 10 ? "" : "Введите 10 цифр после +7";
    if (digits.length !== 10 || !form.checkValidity()) {
      form.reportValidity();
      setStatus(form, "Проверьте телефон и согласие на обработку данных.", true);
      return;
    }
    const submit = $("button[type='submit']", form);
    const label = $("[data-submit-label]", form);
    submit.disabled = true; label.textContent = "Отправляем"; setStatus(form, "");

    const done = () => { submit.disabled = false; label.textContent = "Перезвоните мне"; };

    if (isPreviewHost()) {
      await new Promise((r) => setTimeout(r, 450));
      setStatus(form, "Готово. В демонстрационном режиме номер не передан и не сохранён.");
      track("form_success", { mode: "preview" });
      form.reset(); captureAttribution(); setScenario(currentCase());
      done(); return;
    }
    if (!config.formEndpoint) {
      setStatus(form, `Форма ещё не подключена. Позвоните по номеру ${PHONE}.`, true);
      track("form_error", { reason: "endpoint_missing" });
      done(); return;
    }
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    try {
      const res = await fetch(config.formEndpoint, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" }, signal: controller.signal });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      setStatus(form, "Заявка отправлена. Свяжемся с вами по указанному номеру.");
      track("form_success", { mode: "production" });
      form.reset(); captureAttribution(); setScenario(currentCase());
    } catch (_e) {
      setStatus(form, `Не удалось отправить форму. Позвоните по номеру ${PHONE}.`, true);
      track("form_error", { reason: "request_failed" });
    } finally {
      clearTimeout(timeout); done();
    }
  }

  function initForms() {
    if (isPreviewHost()) {
      $$("[data-form-note]").forEach((n) => { n.textContent = "Демонстрационная версия: номер никуда не передаётся и не сохраняется."; });
    }
    $$("[data-callback-form]").forEach((form) => {
      let started = false;
      const start = () => { if (started) return; started = true; track("form_start"); };
      form.addEventListener("focusin", start);
      form.addEventListener("input", start);
      form.addEventListener("submit", (e) => { e.preventDefault(); sendForm(form); });
      const phone = form.elements.namedItem("phone");
      phone.addEventListener("input", () => { phone.value = formatPhone(phone.value); phone.removeAttribute("aria-invalid"); $("[data-phone-error]", form).textContent = ""; });
    });
    $$("[data-scroll-form]").forEach((a) => a.addEventListener("click", () => track("callback_scroll")));
  }

  function initFaqTracking() {
    $$("[data-faq]").forEach((d) => d.addEventListener("toggle", () => { if (d.open) track("faq_open", { question: ($("summary", d)?.textContent || "").trim() }); }));
  }

  function initReveal() {
    const items = $$("[data-reveal]");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) { items.forEach((i) => i.classList.add("is-revealed")); return; }
    document.documentElement.classList.add("js-motion");
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((en) => { if (!en.isIntersecting) return; en.target.classList.add("is-revealed"); obs.unobserve(en.target); });
    }, { rootMargin: "0px 0px -8%", threshold: 0.08 });
    items.forEach((i) => io.observe(i));
  }

  function initDayRail() {
    const track_ = $("[data-day-track]");
    const fill = $("[data-day-fill]");
    if (!track_ || !fill) return;
    let ticking = false;
    const update = () => {
      ticking = false;
      const r = track_.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = Math.min(1, Math.max(0, (vh * 0.7 - r.top) / r.height));
      fill.style.setProperty("--progress", `${(progress * 100).toFixed(1)}%`);
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
  }

  function initChrome() {
    const hero = $(".hero");
    const header = $("[data-header]");
    const bar = $("[data-mobile-callbar]");
    if (!hero || !("IntersectionObserver" in window)) { header?.classList.add("is-scrolled"); return; }
    new IntersectionObserver(([en]) => {
      const past = !en.isIntersecting;
      header?.classList.toggle("is-scrolled", past);
      bar?.classList.toggle("is-visible", past);
    }, { threshold: 0.04 }).observe(hero);
  }

  initMetrika();
  captureAttribution();
  initScenarios();
  initPhoneTracking();
  initCallDialog();
  initForms();
  initFaqTracking();
  initReveal();
  initDayRail();
  initChrome();
})();
