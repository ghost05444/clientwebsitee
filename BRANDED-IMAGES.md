# Product images carrying the old supplier's logo

Working list for sourcing replacement photography.

- **11 products confirmed** — logo seen in the image
- **152 products likely** — own-brand ranges, need a look
- **836 products with images** in total

## How this list was built

OCR was tried first and is not adequate on its own: it flagged 3 images out
of 966 and missed helmets whose logo is plainly visible, because Tesseract
cannot read a mark moulded into curved, glossy plastic.

So the catalogue was rendered as numbered contact sheets and reviewed by eye.
The confirmed list below comes from that review. The "likely" list is every
product in the source company's own manufactured ranges — their own goods, so
they carry their own logo more often than not.

**To finish the audit:** the review covered 4 of 21 sheets, so the confirmed
list is a floor rather than a total. The remainder can be checked straight
from the site — open each category under `/products/` and look at the
thumbnails; anything carrying the old mark needs a replacement photograph.

**To replace an image:** drop the new file into `public/media/` over the path
named in the tables below, keeping the filename, then re-run `npm run build`.
The `-400`/`-900` variants beside it need replacing too, or delete all three
and re-run `npm run images` to regenerate them from the new source.

The `Tile` numbers are from the original review sheets and are kept only so
the two lists can be cross-referenced; the image path is the real identifier.

---

## Confirmed — logo visible

| Tile | Product | Category | Image file |
| --: | --- | --- | --- |
| #573 | **EY66-6** | hearing-protection | `/media/2020/05/EY66-6-1.webp` |
| #535, #536 | **Fusion 6000 Series** | head-protection | `/media/2020/02/200704-087-Fusion-Without-Belt.webp`<br>`/media/2020/02/200704-088-Fusion-Without-Belt.webp` |
| #554 | **FUSION PRO** | head-protection | `/media/2023/06/fusion-pro-3.webp` |
| #324 | **UB 2011S** | fall-protection | `/media/2021/11/210925-157-UB-2011S.webp` |
| #574 | **UD 250** | hearing-protection | `/media/2022/01/UD-250-Ear-Plug-Dispenser-.webp` |
| #290 | **UDK01 PAINTING & MAINTENANCE KIT** | fall-protection | `/media/2020/05/Kit-Bag.webp` |
| #558, #559 | **ULTRA PRO 3000 SERIES** | head-protection | `/media/2023/08/200704-031-Ultra-pro-3000-Without-belt.webp`<br>`/media/2023/08/200704-032-Ultra-Pro-3000-Without-Belt-copy.webp` |
| #529, #530, #567 | **Ultra Vent 7000 Series** | head-protection | `/media/2020/01/Ultra-Vent-7000-Series-1.webp`<br>`/media/2020/01/Ultra-Vent-7000-Series-2.webp`<br>`/media/2024/01/Ultravent-7000.webp` |
| #534 | **Vista 8000 Series** | head-protection | `/media/2020/01/Vista.webp` |
| #482 | **DRC CUT 5 – cut level 5 / C liner** | hand-protection | `/media/2023/08/DRC-CUT-5.webp` |
| #498 | **NDJ S2** | hand-protection | `/media/2024/03/NDJ-S2.webp` |

---

## Likely — own-brand ranges, confirm by eye

Grouped by range. These are the source company's own products, so most will
carry the logo somewhere on the item.

### EDGE — 58 product(s)

| Product | Category | Image file |
| --- | --- | --- |
| EDGE – DD MF | foot-protection | `/media/2020/02/490252500.edge-dd-mf.webp` |
| EDGE 15 (GI) | fall-protection | `/media/2024/01/EDGE-15.webp` |
| EDGE 2.5 MINI | fall-protection | `/media/2023/12/EDGE-MINI-BLOCK.webp` |
| EDGE 212 (TRIPOD) | fall-protection | `/media/2024/05/aa.webp` |
| EDGE 25 | fall-protection | `/media/2025/07/EDGE-25.webp` |
| EDGE 3.5 | fall-protection | `/media/2022/07/edge-3-5.webp` |
| EDGE 3.5N | fall-protection | `/media/2024/01/EDGE-3.5N.webp` |
| EDGE 30 | fall-protection | `/media/2025/07/EDGE-30.webp` |
| EDGE 6LE | fall-protection | `/media/2024/01/EDGE-6LE-1.webp` |
| EDGE 6N | fall-protection | `/media/2023/11/EDGE-6N2.webp` |
| EDGE ACTIVE | foot-protection | `/media/2024/06/EDGE-ACTIVE.webp` |
| EDGE AERO | foot-protection | `/media/2024/03/EDGE-AERO_240710-583.webp` |
| EDGE AS | fall-protection | `/media/2020/02/2001329692.ss-wire-rope-sling.webp` |
| EDGE BEAM ROLLER | fall-protection | `/media/2020/02/Roller-Beam-Anchor.webp` |
| EDGE CHELSEA | foot-protection | `/media/2024/06/EDGE-CHELSEA.webp` |
| EDGE COMFORT | foot-protection | `/media/2024/06/EDGE-COMFORT_240710-604.webp` |
| EDGE DD EX | foot-protection | `/media/2024/08/EDGE-DD-EX.webp` |
| EDGE ELECT | foot-protection | `/media/2024/06/EDGE-ELECT_240710-546.webp` |
| EDGE ELECT EX | foot-protection | `/media/2020/02/WhatsApp-Image-2024-06-17-at-16.46.03_970cdf4f-4.webp` |
| EDGE ESD | foot-protection | `/media/2024/03/EDGE-ESD_240710-499_edit.webp` |
| Edge Heavy Duty | fall-protection | `/media/2020/02/220622-093-EDGE-25-30.webp` |
| EDGE HIKE | foot-protection | `/media/2024/06/EDGE-HIKE_240710-578.webp` |
| EDGE HONOR | foot-protection | `/media/2024/06/EDGE-HONOR_240710-588.webp` |
| EDGE HUMMER | foot-protection | `/media/2024/03/EDGE-HUMMER_240710-488.webp` |
| EDGE KNIT | foot-protection | `/media/2023/04/edge1.webp` |
| EDGE LITE | foot-protection | `/media/2024/06/EDGE-LITE_240710-528.webp` |
| EDGE LSD | foot-protection | `/media/2024/06/EDGE-LSD.webp` |
| EDGE LSS | foot-protection | `/media/2024/06/EDGE-LSS.webp` |
| EDGE MARSHAL | foot-protection | `/media/2024/06/EDGE-MARSHAL.webp` |
| EDGE MASTER | foot-protection | `/media/2024/06/EDGE-MASTER_240710-512_edit.webp` |
| EDGE MF SLIPON | foot-protection | `/media/2024/06/EDGE-MF-SLIP-ON_240710-593.webp` |
| EDGE MICROFIBER (Black) | foot-protection | `/media/2020/02/EDGE-MICROFIBRE-BLACK-New-Sole-1.webp` |
| EDGE MICROFIBER (Brown) | foot-protection | `/media/2020/02/EDGE-MICROFIBRE-BROWN-New-Sole.webp` |
| EDGE NANO 1.8 (SCAFFOLDING HOOK) Retractable Fall Arrester | fall-protection | `/media/2023/10/EDGE-NANO-R.webp` |
| EDGE NANO 1.8 (SNAP HOOK) Retractable Fall Arrester | fall-protection | `/media/2023/10/NANO.webp` |
| EDGE NANO TWIN 1.8 (SCAFFOLDING HOOK) WITH ADAPTOR | fall-protection | `/media/2024/06/EDGE-NANO-TWIN-1.webp` |
| EDGE NANO TWIN 1.8 (SNAP HOOK)WITH ADAPTOR | fall-protection | `/media/2023/06/EDGE-NANO-TWIN-1.webp` |
| Edge Over | eye-protection | `/media/2020/05/181025-34-Edge-over-clear.webp` |
| Edge Plus | eye-protection | `/media/2020/02/14-1.webp` |
| EDGE PRIDE | foot-protection | `/media/2024/06/EDGE-PRIDE.webp` |
| EDGE RE | fall-protection | `/media/2022/07/220622-083-EDGE-RE-10.webp` |
| EDGE RIGGER | other-products | `/media/2020/02/WhatsApp-Image-2024-06-17-at-16.46.03_970cdf4f-4.webp` |
| EDGE RL 06 & 10 Rescue Ladder | fall-protection | `/media/2023/04/WEBBING-LADDER-6Mtr.webp` |
| EDGE SPORTY | foot-protection | `/media/2023/04/edge2.webp` |
| EDGE SRL | fall-protection | `/media/2025/09/slr.webp` |
| EDGE THUNDER | foot-protection | `/media/2024/06/EDGE-THUNDER_240710-468_edit.webp` |
| Edge Trax | eye-protection | `/media/2020/05/181025-299-Edge-Trax-1.webp` |
| EDGE TREK | foot-protection | `/media/2024/06/Edge-trek_240710-483_edit.webp` |
| EDGE UHA7002 (Hand Ascender) | fall-protection | `/media/2026/01/UHA7002.webp` |
| Edge Ultra | eye-protection | `/media/2020/05/181025-235-Edge-Ultra-Clear-AF-1.webp` |
| EDGE URBAN | foot-protection | `/media/2024/06/EDGE-URBAN_240710-568.webp` |
| Edge Vision | eye-protection | `/media/2020/06/181025-299-Edge-vision-clear-AF-1.webp` |
| EDGE- DD MF AK | foot-protection | `/media/2020/04/EDGE-DD-AK_240710-599.webp` |
| EDGE-DD MF | foot-protection | `/media/2023/04/edge3.webp` |
| EDGE-EX MF | foot-protection | `/media/2023/04/EDGE-MF-EX_240710-614.webp` |
| EDGE(GI) | fall-protection | `/media/2022/07/Edge-Retractable-fall-arrester-2.webp` |
| Hand Descender-EDGE D01 | fall-protection | `/media/2020/02/Descender.webp` |
| Ultra Edge | eye-protection | `/media/2023/06/Ultra-Edge-Clear.webp` |

### RES-PROTEK — 31 product(s)

| Product | Category | Image file |
| --- | --- | --- |
| Res-protek 3001 | respiratory-protection | `/media/2024/02/Res-protek-3001.webp` |
| Res-protek 3003 | respiratory-protection | `/media/2024/02/Res-protek-3003.webp` |
| Res-Protek 3005 | respiratory-protection | `/media/2025/11/3005.webp` |
| Res-protek 4001 | respiratory-protection | `/media/2024/08/Res-protek-4001.webp` |
| Res-protek 4002 | respiratory-protection | `/media/2024/02/Res-protek-4002-1.webp` |
| Res-protek 4200 | respiratory-protection | `/media/2024/02/Image-2024.webp` |
| Res-protek 42126IV | respiratory-protection | `/media/2024/08/Res-protek-42126IV.webp` |
| Res-protek 4701 | respiratory-protection | `/media/2024/02/4200.webp` |
| Res-protek 4800 | respiratory-protection | `/media/2024/08/Res-protek-4800.webp` |
| Res-protek 485 | respiratory-protection | `/media/2024/08/Res-protek-4N11.webp` |
| Res-protek 4N11 | respiratory-protection | `/media/2024/08/Res-protek-4N11.webp` |
| Res-protek 810 | respiratory-protection | `/media/2024/02/811-1.webp` |
| RES-PROTEK 8103PR | respiratory-protection | `/media/2024/06/RES-PROTEK-8103PR.webp` |
| Res-protek 8106PR | respiratory-protection | `/media/2024/08/Res-protek-8106PR.webp` |
| Res-protek 811 | respiratory-protection | `/media/2024/02/811-1.webp` |
| RES-PROTEK 8200 | respiratory-protection | `/media/2023/12/8200-c.webp` |
| Res-protek 82121EV | respiratory-protection | `/media/2024/07/WhatsApp-Image-2024-06-17-at-16.46.03_970cdf4f-4-247x247-1.webp` |
| Res-protek 82124HH | respiratory-protection | `/media/2024/08/82124HH_20240731.webp` |
| Res-protek 88111L | respiratory-protection | `/media/2024/08/88111L-LENS.webp` |
| Res-protek 88112LC | respiratory-protection | `/media/2024/08/88112LC-2.webp` |
| Res-protek 88113FB | respiratory-protection | `/media/2024/08/88113FB_20240731_164744.webp` |
| Res-protek 88114HH | respiratory-protection | `/media/2024/08/20240731_162816-88114HH.webp` |
| Res-protek 88115NC | respiratory-protection | `/media/2024/08/88115NC-NOSE-CUP-2-copy.webp` |
| Res-protek 88116CG | respiratory-protection | `/media/2024/08/88116CG.webp` |
| Res-protek 88117IG | respiratory-protection | `/media/2024/08/88117IG.webp` |
| Res-protek 88119FL | respiratory-protection | `/media/2024/08/88119FL-FRONT-LID-2-copy.webp` |
| Res-protek 8882118IV | respiratory-protection | `/media/2024/07/WhatsApp-Image-2024-06-17-at-16.46.03_970cdf4f-4-247x247-1.webp` |
| Res-protek 8890120EV | respiratory-protection | `/media/2024/07/WhatsApp-Image-2024-06-17-at-16.46.03_970cdf4f-4-247x247-1.webp` |
| Res-protek 9000 | respiratory-protection | `/media/2023/12/Res-protek-9000.webp` |
| Res-protek 90122IV | respiratory-protection | `/media/2024/07/WhatsApp-Image-2024-06-17-at-16.46.03_970cdf4f-4-247x247-1.webp` |
| Res-protek 90123HH | respiratory-protection | `/media/2024/08/90123HH.webp` |

### ULTRA — 18 product(s)

| Product | Category | Image file |
| --- | --- | --- |
| Ultra 5000 Series | head-protection | `/media/2020/01/Ultra-5000-Series-2.webp` |
| ULTRA ERGO | eye-protection | `/media/2025/07/ULTRA-EGRO.webp` |
| ULTRA Nano | fall-protection | `/media/2025/07/ULTRA-Nano.webp` |
| Ultra Over | eye-protection | `/media/2023/06/ULTRA-OVERSMOKE.webp` |
| ULTRA OVER Safety Spectacle | eye-protection | `/media/2023/03/u7.webp` |
| Ultra Sports | eye-protection | `/media/2023/06/ULTRA-SPORTSSMOKE.webp` |
| ULTRA SPORTS Safety Smoke Spectacle | eye-protection | `/media/2023/03/u5.webp` |
| ULTRA SPORTS Safety Spectacle | eye-protection | `/media/2023/03/u4.webp` |
| ULTRA TUFF 2000 Series | head-protection | `/media/2023/08/ULTRA-TUFF-2000.webp` |
| ULTRA WIDE | eye-protection | `/media/2025/07/ULTRA-WIDE.webp` |
| ULTRA-05 | fall-protection | `/media/2021/10/ultra5.webp` |
| Ultra-Z | eye-protection | `/media/2023/06/ULTRA-ZSMOKE.webp` |
| ULTRA-Z Safety Spectacle | eye-protection | `/media/2023/03/u6.webp` |
| Ultratek | fall-protection | `/media/2020/02/200630-032-Ultratech-1-scaled.webp` |
| ULTRATEK ANTI STATIC | fall-protection | `/media/2021/12/200630-035-Ultratek-AS.webp` |
| ULTRATEK DE | fall-protection | `/media/2024/09/ULTRATEK-DE.webp` |
| Ultraview | eye-protection | `/media/2020/02/1221575726.ultra-view-product.webp` |
| Ultraview-IR | eye-protection | `/media/2020/02/181025-949-Ultraview-IR.webp` |

### METPROTEK — 8 product(s)

| Product | Category | Image file |
| --- | --- | --- |
| Metprotek D3E3 GREEN NAVY BLUE IFR Trousers (MT330NGT) | body-protection | `/media/2024/09/MT330NGT-METPROTEK-NB-GR-Trousers.webp` |
| Metprotek D3E3 GREEN-NAVY BLUE IFR Jacket (MT330NGJ) | body-protection | `/media/2024/09/METPROTEK-NB-GR-Jacket.webp` |
| Metprotek D3E3 Light Blue IFR Jacket (MT330LBJ) | body-protection | `/media/2024/09/METPROTEK-LB_jacket.webp` |
| Metprotek D3E3 NAVY BLUE IFR Jacket (MT330NJ) | body-protection | `/media/2024/09/MT330NJ-METPROTEK-NB_jacket.webp` |
| Metprotek D3E3 Navy Blue Red IFR Jacket (MT330NRJ) | body-protection | `/media/2024/09/MT330NRJ-METPROTEK-RD-NB-Jacket.webp` |
| Metprotek D3E3 Navy Blue Yellow IFR Trousers (MT330NYT) | body-protection | `/media/2024/09/MT330NYT-METPROTEK-LB-Trouser.webp` |
| Metprotek D3E3 Navy Red IFR Trousers (MT330NRT) | body-protection | `/media/2024/09/MT330NRT-METPROTEK-RD-NB_Trousers.webp` |
| Metprotek NAVY BLUE SILVER D3E3 IFR Trousers (MT330NST) | body-protection | `/media/2024/09/MT330NST-Trousers-Navy-blue.webp` |

### ARC KNIGHT — 7 product(s)

| Product | Category | Image file |
| --- | --- | --- |
| ARC KNIGHT PRO 12 CAL KIT | arc-flash-eletrical-safety | `/media/2020/02/12-CAL.webp` |
| Arc Knight Pro 20cal Kit | arc-flash-eletrical-safety | `/media/2024/09/Arc-Knight-Pro-20cal-Kit.webp` |
| Arc Knight Pro 25cal Kit | arc-flash-eletrical-safety | `/media/2020/02/25-CAL.webp` |
| Arc Knight Pro 33cal Kit | arc-flash-eletrical-safety | `/media/2024/09/ss.webp` |
| ARC KNIGHT PRO 40 CAL KIT | arc-flash-eletrical-safety | `/media/2020/02/40-CAL.webp` |
| Arc Knight Pro 8cal Kit | arc-flash-eletrical-safety | `/media/2020/02/8CAL.webp` |
| Arc Knight Pro Uni-Q 40cal Kit | arc-flash-eletrical-safety | `/media/2024/09/AKP320NBK40I3.webp` |

### GALAXY — 6 product(s)

| Product | Category | Image file |
| --- | --- | --- |
| GALAXY ANKLE BOOT | foot-protection | `/media/2024/06/GALAXY-ANKLE-BOOT.webp` |
| Galaxy Duos | eye-protection | `/media/2020/02/1329703691.galaxy-duos.webp` |
| Galaxy Duos Acetate | eye-protection | `/media/2020/02/1329703691.galaxy-duos.webp` |
| Galaxy Duos Acetate with Peel Off | eye-protection | `/media/2020/02/1329703691.galaxy-duos.webp` |
| GALAXY REX | foot-protection | `/media/2024/06/GALAXY-REX.webp` |
| GALAXY REX AK | foot-protection | `/media/2020/02/WhatsApp-Image-2024-06-17-at-16.46.03_970cdf4f-4.webp` |

### TANGO — 5 product(s)

| Product | Category | Image file |
| --- | --- | --- |
| TANGO – DD MF | foot-protection | `/media/2020/02/TANGO-DD_240710-517_edit.webp` |
| TANGO – EX MF | foot-protection | `/media/2020/02/TANGO-EX_240710-624.webp` |
| Tango II | fall-protection | `/media/2020/02/210925-077-TANGO-II.webp` |
| TANGO IMPACT | foot-protection | `/media/2020/04/TANGO-IMPACT_240710-522_edit.webp` |
| TANGO PVC ANKLE BOOT | foot-protection | `/media/2024/06/TANGO-ANKLE-BOOT_240710-563.webp` |

### LIGHTON — 4 product(s)

| Product | Category | Image file |
| --- | --- | --- |
| Lighton | head-protection | `/media/2023/12/LIGHTON-231003-147_P.webp` |
| Lighton ES | head-protection | `/media/2020/05/200704-035-LightOn-ES-Without-Belt-2.webp` |
| Lighton M | head-protection | `/media/2023/12/lighon-m.webp` |
| Lighton V | head-protection | `/media/2020/12/LightOn-V-–-Safety-Helmet.webp` |

### UFORCE — 4 product(s)

| Product | Category | Image file |
| --- | --- | --- |
| UFORCE 1010 | foot-protection | `/media/2024/06/UFORCE-1010_240710-536.webp` |
| UFORCE 1020 | foot-protection | `/media/2024/06/UFORCE-1020.webp` |
| UFORCE 2010 | foot-protection | `/media/2024/01/UFORCE-2010_240710-541.webp` |
| UFORCE 2020 | foot-protection | `/media/2024/06/UFORCE-2020_240710-609.webp` |

### PROTON — 3 product(s)

| Product | Category | Image file |
| --- | --- | --- |
| Proton | fall-protection | `/media/2020/02/PROTON-BLOCK_NEW-PICTURE_marge.webp` |
| Proton 4000 Series | head-protection | `/media/2023/08/proton.webp` |
| Proton Natural Rubber Gloves | hand-protection | `/media/2021/09/181025-806-Proton-1.webp` |

### ROCKMASTER — 2 product(s)

| Product | Category | Image file |
| --- | --- | --- |
| ROCKMASTER (W/O-S/T) | foot-protection | `/media/2023/04/gamboot.webp` |
| ROCKMASTER (WITH STEEL TOE) | foot-protection | `/media/2024/06/ROCKMASTER_240716-263.webp` |

### THERMOGUARD — 2 product(s)

| Product | Category | Image file |
| --- | --- | --- |
| Thermoguard | eye-protection | `/media/2020/05/12.webp` |
| Thermoguard 9000 Series | head-protection | `/media/2023/06/thermoground-9000-serieis.webp` |

### ALERT — 1 product(s)

| Product | Category | Image file |
| --- | --- | --- |
| ALERT PLUS RHJ680/A | sgbi | `/media/2024/07/alert.webp` |

### BIGBOSS — 1 product(s)

| Product | Category | Image file |
| --- | --- | --- |
| BIGBOSS (WITH STEEL TOE) | foot-protection | `/media/2024/06/BIGBOSS.webp` |

### PRITHVI — 1 product(s)

| Product | Category | Image file |
| --- | --- | --- |
| PRITHVI | head-protection | `/media/2023/03/PRITHVI.webp` |

### SAFE TOP — 1 product(s)

| Product | Category | Image file |
| --- | --- | --- |
| Safe Top Blue – Bump Cap | eye-protection | `/media/2023/04/blue-bump.webp` |

