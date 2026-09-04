#!/usr/bin/env python3
"""Собирает артборды дизайн-канваса из исходников посадочной.

index.html + styles.css → Main.dc.html (десктоп) и Mobile.dc.html (390 px).
Плюс два низкодетальных альтернативных направления и canvas.json.
Картинки берутся из уменьшенных копий в этой папке.
"""
from __future__ import annotations
import json, pathlib, re

ROOT = pathlib.Path(__file__).resolve().parent.parent
D = pathlib.Path(__file__).resolve().parent

html = (ROOT / "index.html").read_text(encoding="utf-8")
css = (ROOT / "styles.css").read_text(encoding="utf-8")

# --- CSS: локальные шрифты → Google Fonts, без скрытия контента
css = re.sub(r"@font-face \{[^}]*\}\n?", "", css)
css = css.replace('.js.js-motion [data-reveal] { opacity: 0;', '.never [data-reveal] { opacity: 0;')
css = css.replace('.js.js-motion [data-reveal].is-revealed', '.never [data-reveal].is-revealed')
css = css.replace(".is-revealed .strike { background-size: 100% 3px; }", ".ledger .strike { background-size: 100% 3px; }")
css = css.replace(".day-item.is-revealed::before", ".day-item::before")
css = css.replace("background: var(--deep); border: 2px solid var(--on-deep-2); transition", "background: var(--signal); border: 2px solid var(--signal); transition")
css += "\n.day-rail-fill { height: 100%; }\n.mobile-callbar { display: none !important; }\n"

# --- body
body = re.search(r"<body[^>]*>(.*)</body>", html, re.S).group(1)
body = re.sub(r"\s*<script[^>]*>.*?</script>", "", body, flags=re.S)
body = re.sub(r"<dialog.*?</dialog>", "", body, flags=re.S)
body = body.replace('<a class="skip-link" href="#main">Перейти к содержанию</a>', "")

# картинки
img_map = {
    "assets/images/hero-architecture.webp": "hero.jpg",
    "assets/images/situation-family-v2.webp": "situation-family.jpg",
    "assets/images/situation-alcohol-v2.webp": "situation-alcohol.jpg",
    "assets/images/situation-drugs-v2.webp": "situation-drugs.jpg",
    "assets/images/courtyard-evening.webp": "courtyard-evening.jpg",
    "assets/images/bedroom.webp": "bedroom.jpg",
    "assets/images/group-circle.webp": "group-circle.jpg",
    "assets/images/kitchen.webp": "kitchen.jpg",
    "assets/images/pool.webp": "pool.jpg",
    "assets/images/sauna.webp": "sauna.jpg",
    "assets/images/logo.png": "logo.png",
}
for a, b in img_map.items():
    body = body.replace(a, b)

# булевы атрибуты → с значением, каноничный HTML
for attr in ("required", "open", "novalidate", "disabled"):
    body = re.sub(rf"\s{attr}(?=[\s>])", f' {attr}="{attr}"', body)
body = body.replace(' fetchpriority="high"', "").replace(' decoding="async"', "").replace(' loading="lazy"', "")
body = re.sub(r"\s(data-[a-z-]+)(?=[\s>])", r' \1="\1"', body)

def artboard(title: str, inner: str, extra_css: str = "") -> str:
    return f"""<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
  <title>{title}</title>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Commissioner:wght@500;700;800;900&family=Onest:wght@400;500;600;700&display=swap">
  <style>
{css}
{extra_css}
  </style>
</helmet>
<div class="page" data-case="family">
{inner}
</div>
</x-dc>
</body>
</html>
"""

# в x-dc нет body: правила body переносим на .page
page_css = ".page { margin: 0; background: var(--ground); color: var(--ink); font: 400 17px/1.55 var(--f-body); font-variant-numeric: tabular-nums; overflow-x: hidden; min-height: 100%; }\n.site-header { position: relative; }"
(D / "Main.dc.html").write_text(artboard("ОСНОВА · посадочная · десктоп", body, page_css), encoding="utf-8")
(D / "Mobile.dc.html").write_text(artboard("ОСНОВА · посадочная · телефон", body, page_css), encoding="utf-8")

# --- альтернативные направления (низкодетальные эскизы)
sketch_css = """
    .sk { width: 1440px; height: 900px; box-sizing: border-box; padding: 40px; font-family: "Onest", Arial, sans-serif; color: #111; position: relative; overflow: hidden; }
    .sk h1 { font-family: "Commissioner", Arial, sans-serif; font-weight: 800; letter-spacing: -0.02em; line-height: 1; margin: 0; }
    .sk p { margin: 0; }
    .note { position: absolute; left: 40px; bottom: 32px; right: 40px; font-size: 14px; opacity: .8; display: flex; gap: 24px; }
    .note b { font-weight: 700; }
    .box { border: 2px dashed rgba(0,0,0,.35); display: flex; align-items: center; justify-content: center; font-size: 14px; letter-spacing: .08em; text-transform: uppercase; }
"""
direction_b = artboard("Направление B · Ночной звонок", """
<div class="sk" style="background:#07100c; color:#eef1ec;">
  <p style="font-size:12px; letter-spacing:.14em; text-transform:uppercase; color:#f2b134;">Направление B · «Ночной звонок»</p>
  <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 60px; align-items: center;">
    <div>
      <p style="font-size:14px; color:rgba(238,241,236,.6);">Сейчас 02:40. Вы не спите, потому что он не дома.</p>
      <h1 style="font-size:150px; margin-top:24px;">+7 928<br>963-32-80</h1>
      <p style="margin-top:24px; font-size:22px; max-width:30ch; color:rgba(238,241,236,.75);">Один экран, один номер, без формы. Кнопка занимает всю ширину телефона. Дальше только «день по часам».</p>
    </div>
    <div class="box" style="height:560px; border-color: rgba(238,241,236,.35); color:rgba(238,241,236,.6);">кинематографичное фото ночного двора</div>
  </div>
  <div class="note" style="color:rgba(238,241,236,.7);"><span><b>За:</b> максимальная ясность в кризисе, самый сильный мобильный экран</span><span><b>Против:</b> мало доказательств до звонка, хуже для запроса «реабилитационный центр»</span></div>
</div>
""", sketch_css)
direction_c = artboard("Направление C · Соседский двор", """
<div class="sk" style="background:#f3efe4;">
  <p style="font-size:12px; letter-spacing:.14em; text-transform:uppercase; color:#164a38;">Направление C · «Соседский двор»</p>
  <div style="display:grid; grid-template-columns: 1.2fr .8fr; gap: 40px; margin-top: 60px;">
    <div class="box" style="height:600px;">большое дневное фото двора: люди, стол, шашлыки (лица скрыты)</div>
    <div>
      <h1 style="font-size:64px;">Это обычный дом в Ставрополе. Здесь учатся жить без этого.</h1>
      <p style="margin-top:24px; font-size:20px; color:#4f5d57; max-width:34ch;">Тёплая, «своя» подача: фотографии впереди текста, распорядок как расписание на холодильнике, минимум тёмных экранов.</p>
      <div class="box" style="height:64px; margin-top:32px; border-radius:999px;">позвонить · спросить о визите</div>
    </div>
  </div>
  <div class="note"><span><b>За:</b> снимает страх «закрытого учреждения», сильно для семьи</span><span><b>Против:</b> ближе к «Здоровому Ставрополью» и другим тёплым лендингам, слабее отстройка</span></div>
</div>
""", sketch_css)
(D / "DirectionB.dc.html").write_text(direction_b, encoding="utf-8")
(D / "DirectionC.dc.html").write_text(direction_c, encoding="utf-8")

canvas = {
    "artboards": [
        {"file": "Main.dc.html", "title": "Десктоп 1440", "x": 0, "y": 0, "w": 1440, "h": 9900, "expand": "fill", "print": "flow"},
        {"file": "Mobile.dc.html", "title": "Телефон 390", "x": 1540, "y": 0, "w": 390, "h": 14700, "expand": "fill", "print": "flow"},
        {"file": "DirectionB.dc.html", "title": "Альтернатива B · Ночной звонок", "x": 0, "y": 15000, "w": 1440, "h": 900},
        {"file": "DirectionC.dc.html", "title": "Альтернатива C · Соседский двор", "x": 1540, "y": 15000, "w": 1440, "h": 900},
    ],
    "annotations": [
        {"id": "brief", "x": 2000, "y": 0, "w": 420, "text": "Выбранное направление — «Дневник центра»: против рыночных гарантий, день по часам, четыре сценария.\n\nЯнтарные метки на странице — данные, которых пока нет: цена, срок, адрес, юрлицо, лицензия партнёра, время ответа.\n\nНиже — два альтернативных направления, набросками: только чтобы сравнить, не для сборки."}
    ],
    "launch": {"view": "canvas"},
}
(D / "canvas.json").write_text(json.dumps(canvas, ensure_ascii=False, indent=2), encoding="utf-8")
print("artboards written:", [p.name for p in D.glob("*.dc.html")])
