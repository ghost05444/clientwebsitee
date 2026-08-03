/**
 * Hazard-led entry points into the catalogue.
 *
 * Buyers rarely arrive thinking "I need category 7". They arrive thinking
 * "I have people going into a vessel on Tuesday". Each solution below starts
 * from that hazard and lands on real products, so this file is hand-written
 * content — unlike `products.json` / `categories.json`, which are generated.
 *
 * Slugs and display names live in `solution-nav.ts` (which the header can
 * import without pulling all of this prose into the client bundle); the
 * `slug` field below is typed against it, so the two cannot drift.
 *
 * `relatedCategorySlugs` are resolved against the live catalogue at build
 * time by `@/lib/solutions`; a slug that no longer exists is logged and
 * skipped rather than throwing, so a taxonomy change can never break a build.
 */
import type { SolutionSlug } from "@/data/solution-nav";

export type SolutionStep = {
  /** assess -> specify -> supply, in order. */
  title: string;
  body: string;
};

export type SolutionStandard = {
  code: string;
  meaning: string;
};

export type SolutionFaq = {
  q: string;
  a: string;
};

/**
 * The written half of a solution. `name` is not here — it comes from
 * `SOLUTION_NAV`, and `@/lib/solutions` joins the two into a `Solution`.
 */
export type SolutionContent = {
  slug: SolutionSlug;
  /** Short line under the hero title. */
  heroTagline: string;
  /** Exactly two paragraphs — the second is the technical half. */
  intro: [string, string];
  /** What actually goes wrong on site. */
  hazards: string[];
  approach: [SolutionStep, SolutionStep, SolutionStep];
  standards: SolutionStandard[];
  relatedCategorySlugs: string[];
  faq: SolutionFaq[];
};

export const solutionContent: SolutionContent[] = [
  /* ================================================================== */
  {
    slug: "confined-space-entry-rescue",
    heroTagline:
      "Tanks, vessels, sumps and silos — the entries that kill rescuers as often as entrants.",
    intro: [
      "A confined space is any enclosure a person can get into, that was never designed for someone to work in, and that has a restricted way out. On a working plant that covers more than people expect: reaction vessels and storage tanks, effluent sumps, cable trenches, silos, ship holds, even a large duct during a shutdown. The hazard is rarely the space itself — it is the atmosphere inside it, which can go from breathable to fatal without any warning a person can sense.",
      "Entry equipment therefore comes as a system, not a shopping list. You need to know the atmosphere before anyone goes in and continuously while they are in there, you need to keep it breathable or supply air independently, and you need a retrieval path that works on an unconscious casualty without a second person entering. Those four jobs map onto gas detection, ventilation, breathing apparatus and a tripod-and-winch retrieval set — and they only work together if they were specified together.",
    ],
    hazards: [
      "Oxygen deficiency from rust, fermentation or inert gas purging — no smell, no warning, and unconsciousness inside a few breaths.",
      "Flammable vapour left in a vessel that was signed off as clean, ignited by a non-intrinsically-safe torch or a grinder outside the manway.",
      "Toxic residue — hydrogen sulphide in effluent lines, solvent vapour in tank bottoms — that peaks when sludge is disturbed rather than at entry.",
      "Engulfment in free-flowing solids: an entrant on a silo bridge that collapses when discharge starts below.",
      "A retrieval system rigged to a handrail or scaffold tube instead of a rated anchor, which fails at the moment it is finally needed.",
      "Would-be rescuers entering without their own air supply — historically the largest single cause of multiple fatalities in confined space incidents.",
    ],
    approach: [
      {
        title: "Assess the space, not the job",
        body: "We walk the entry with you: what the vessel last held, how it was purged, where the manway sits, how far a casualty would have to travel to reach it, and whether a tripod can physically stand over the opening. That last question decides more equipment specs than anything else, and it is the one most often answered too late.",
      },
      {
        title: "Specify the system together",
        body: "Detector, blower, airline or SCBA, harness, retrieval winch and anchor get chosen as one set. We check the connections actually mate, that the winch rated load suits the entrant plus kit, and that the harness has the right rescue attachment — a fall-arrest-only harness will not lift a casualty in a controlled position.",
      },
      {
        title: "Supply, and make it usable",
        body: "Equipment is delivered with the certification your permit-to-work file needs, plus a walk-through of donning, bump-testing and rigging for the people who will actually use it. We supply the consumables — filters, calibration gas, spare harness sizes — on a repeat schedule so nothing expires quietly between shutdowns.",
      },
    ],
    standards: [
      {
        code: "EN 137",
        meaning:
          "Self-contained open-circuit compressed air breathing apparatus — the full-face SCBA used where the atmosphere cannot be made safe.",
      },
      {
        code: "EN 1496",
        meaning:
          "Rescue lifting equipment — the winch that raises a casualty, tested for the job of lifting a person rather than a load.",
      },
      {
        code: "EN 795",
        meaning:
          "Anchor devices, including the Class B portable tripods and davit arms used over a manway.",
      },
      {
        code: "EN 361",
        meaning:
          "Full body harnesses — the only harness type permitted to arrest a fall or support a suspended casualty.",
      },
      {
        code: "EN 60079-29-1",
        meaning:
          "Performance requirements for detectors of flammable gases — what a portable multi-gas monitor is actually certified against.",
      },
      {
        code: "IS 3521",
        meaning:
          "The Indian standard for industrial safety belts and harnesses, commonly cited in tender specifications alongside the EN equivalents.",
      },
    ],
    relatedCategorySlugs: [
      "confined-space",
      "sgba",
      "gas-detector",
      "industrial-blower-duct",
      "rescue",
      "retractable-lifelines",
      "rescue-stretcher",
    ],
    faq: [
      {
        q: "Do we need SCBA, or will a filter respirator do?",
        a: "A filtering respirator removes specific contaminants from the surrounding air — it cannot add oxygen. If the atmosphere is or could become oxygen-deficient, or if the contaminant is unknown or above the filter's capacity, it must be an independent air supply: SCBA or a supplied-air line with escape cylinder. Filters are only appropriate once continuous monitoring has established what is in the space and that oxygen is normal.",
      },
      {
        q: "Can we anchor the retrieval winch to structure that's already there?",
        a: "Only if that structure has been assessed and rated as an anchor point. Handrails, pipework and scaffold tube routinely fail under the shock load of an arrested fall even though they feel solid. A Class B portable tripod or davit to EN 795 is the usual answer at a manway because it brings its own rated anchor and sits directly over the opening.",
      },
      {
        q: "How often does gas detection need calibrating?",
        a: "Bump-test before every entry, and full calibration to the manufacturer's interval — typically every six months, more often in dirty service or after any reading that pegged the sensor. We supply calibration gas and regulators alongside the instruments so the interval doesn't slip; a detector that has drifted is more dangerous than no detector, because it is trusted.",
      },
    ],
  },

  /* ================================================================== */
  {
    slug: "rescue-from-height",
    heroTagline:
      "Arresting the fall is half the job. Getting them down in under fifteen minutes is the other half.",
    intro: [
      "A harness that arrests a fall has done exactly what it was bought to do — and created a new emergency. A person hanging in a harness is not simply waiting for help. Suspension trauma sets in when the leg straps restrict venous return and blood pools in the lower limbs; a conscious, uninjured worker can deteriorate within minutes, and an unconscious one has no way to relieve the pressure at all. The clock that matters is the one that starts at the moment of arrest.",
      "That is why rescue provision is a legal and practical part of any work-at-height plan, not an optional extra. The plan has to name who performs the rescue, with what equipment, from where — and it has to work without waiting for an external emergency service to arrive, assess and rig. In practice that means a pre-rigged descent or raising kit, stored where the work is, that a trained colleague can deploy on their own.",
    ],
    hazards: [
      "Suspension trauma in a worker who was successfully caught — the arrest worked, and the delay is what causes the harm.",
      "No rescue plan beyond 'call the fire service', on a site where the realistic response time is far longer than the casualty has.",
      "A rescue kit stored in a locked store two buildings away from the tower it exists to serve.",
      "Rescuers improvising with rope and a ladder, turning one casualty into two.",
      "Descent equipment with a working length shorter than the actual drop, discovered mid-rescue.",
      "Casualty pick-off attempted on a fall-arrest harness with no rescue attachment point, leaving no way to control body position during descent.",
    ],
    approach: [
      {
        title: "Assess the drop and the response",
        body: "We map where people work at height, how far they would hang, and who could realistically reach them and in how long. That answers the two specs that matter: descent length and whether the rescue is a controlled lower from above, a raise, or a pick-off requiring the rescuer to reach the casualty.",
      },
      {
        title: "Specify a kit one person can deploy",
        body: "Rescue equipment gets chosen for the worst realistic case, then simplified until a single trained colleague can use it under pressure. Pre-rigged, clearly labelled, sized to the actual drop, with the connectors already made off — every decision moved from the emergency into the store room.",
      },
      {
        title: "Supply, position and re-inspect",
        body: "Kits are supplied with certification and positioned at the work, not in central stores. We schedule the periodic inspection that rescue equipment needs — this is kit that sits unused for a year and then has to work first time — and supply the stretchers and casualty-handling equipment that the ground half of the rescue depends on.",
      },
    ],
    standards: [
      {
        code: "EN 341",
        meaning:
          "Descender devices for rescue — controlled lowering of a person, rated by descent energy and working length.",
      },
      {
        code: "EN 1496",
        meaning:
          "Rescue lifting equipment, for raising a casualty rather than lowering them.",
      },
      {
        code: "EN 1497",
        meaning:
          "Rescue harnesses — the attachment geometry that keeps a casualty upright and airway-open during the lift.",
      },
      {
        code: "EN 1498",
        meaning:
          "Rescue loops — the sling classes used to secure a casualty who is not already wearing a rescue harness.",
      },
      {
        code: "EN 12841",
        meaning:
          "Rope adjustment devices for rope access — type A backup, type B ascent, type C descent.",
      },
      {
        code: "EN 362",
        meaning:
          "Connectors — the karabiners and hooks, with the gate strength and locking action a rescue load demands.",
      },
    ],
    relatedCategorySlugs: [
      "rescue",
      "rope-access-equipments",
      "rescue-stretcher",
      "retractable-lifelines",
      "harness",
      "lanyards",
      "connectors",
    ],
    faq: [
      {
        q: "How quickly does a suspended worker actually need to come down?",
        a: "Plan for minutes, not tens of minutes. Guidance across the industry converges on rescue being achieved well inside fifteen minutes of the arrest, and sooner if the casualty is unconscious or already injured. The practical test for your plan is simple: time a full deployment as a drill. If the kit has to be fetched from another building, the plan has already failed.",
      },
      {
        q: "Can the same harness be used for work, fall arrest and rescue?",
        a: "Often yes, if it is specified that way. A harness certified to EN 361 will arrest a fall; adding EN 358 gives work positioning and EN 1497 gives the rescue attachment that lets a casualty be lifted in a controlled, upright position. Buying the combined specification up front costs far less than discovering the missing attachment point during an incident.",
      },
      {
        q: "Does rescue equipment need inspecting if it has never been used?",
        a: "Yes — arguably more so. Textile components degrade with UV, humidity and contamination whether or not they take a load, and rescue kit is precisely the equipment that sits untouched between inspections. It needs the same documented periodic examination as everyday fall protection, at least annually and to the manufacturer's interval, with records your auditor can see.",
      },
    ],
  },

  /* ================================================================== */
  {
    slug: "arc-flash-protection",
    heroTagline:
      "An arc fault releases its energy in milliseconds. Clothing is the last defence, not the first.",
    intro: [
      "An arc flash is a short circuit through air. It happens when a conductor is bridged — by a dropped spanner, a rodent, moisture tracking across a dirty insulator, or a rack being racked in on a fault. The energy is released as radiant heat, a pressure wave and molten metal in a few milliseconds, far faster than any human reaction. The injuries that follow are overwhelmingly burns, and a significant share of those come not from the arc itself but from ordinary work clothing igniting and continuing to burn.",
      "Protection is therefore ranked: de-energise wherever the work allows it, then engineer the incident energy down, then protect the person. Arc-rated clothing is the last of those, and it is specified numerically — the garment's rating in cal/cm² must exceed the incident energy calculated for the task at the working distance. This is the one PPE category where 'flame retardant' and 'arc rated' are genuinely different claims, and where buying on the wrong one leaves a real gap.",
    ],
    hazards: [
      "Polyester or poly-cotton workwear worn under an arc-rated layer, which melts onto skin and turns a survivable exposure into a critical burn.",
      "Garments bought as 'flame retardant' with no arc rating at all — the fabric will not sustain a flame, but nothing has been established about how much arc energy it stops.",
      "An arc rating chosen from the panel voltage rather than from a calculated incident energy at the actual working distance.",
      "Face and head left unprotected while the torso is over-specified — the exposed skin nearest the arc takes the highest heat flux.",
      "Untucked, unfastened or layered-open garments, which turn a rated system into an unrated one at the gaps.",
      "Insulating gloves used past their retest interval, or without leather overgloves, so a pinhole goes unnoticed.",
    ],
    approach: [
      {
        title: "Assess the task and the energy",
        body: "The starting point is the incident energy for the specific task — racking, live testing, panel entry — at the distance the person's torso and face will actually be. We work from your arc flash study where one exists, and flag it clearly when the specification needs one, rather than guessing a category from the voltage.",
      },
      {
        title: "Specify the whole system to the rating",
        body: "Every layer in the system carries its rating, and the underlayer matters as much as the outer: natural fibre or inherently flame-resistant only, never meltable synthetics. Face shield, balaclava, gloves and footwear get specified alongside the coverall so the protection has no seam through which the energy arrives.",
      },
      {
        title: "Supply with the paperwork the audit wants",
        body: "Arc-rated garments are supplied with the test certification and rating documented, sized properly across the crew — a coverall that does not fit will not be fastened — and with the retest schedule for insulating gloves and mats set up as a recurring supply rather than a yearly panic.",
      },
    ],
    standards: [
      {
        code: "IEC 61482-1-1",
        meaning:
          "Open arc test — produces the ATPV or EBT value in cal/cm² that a garment is rated by.",
      },
      {
        code: "IEC 61482-1-2",
        meaning:
          "Box test — assigns Arc Protection Class 1 (4 kA) or Class 2 (7 kA), the classification common on European garments.",
      },
      {
        code: "IEC 61482-2",
        meaning:
          "Requirements for the finished arc-rated garment, covering construction, fastenings and marking as well as fabric.",
      },
      {
        code: "EN 1149-5",
        meaning:
          "Electrostatic dissipative clothing — relevant where the same crew works in a flammable atmosphere.",
      },
      {
        code: "IEC 60903",
        meaning:
          "Live working — electrical insulating gloves, classified by voltage, with a defined retest interval.",
      },
      {
        code: "EN ISO 11612",
        meaning:
          "Protection against heat and flame — the baseline the arc rating is built on, not a substitute for it.",
      },
    ],
    relatedCategorySlugs: [
      "arc-flash-eletrical-safety",
      "arc-flash-safety",
      "arc-resistance",
      "flash-knight",
    ],
    faq: [
      {
        q: "Is flame-retardant clothing the same as arc-rated clothing?",
        a: "No, and the distinction is the single most expensive misunderstanding in this category. Flame retardant means the fabric will not continue to burn once the ignition source is removed. Arc rated means the garment has been tested against an actual electric arc and assigned a number — an ATPV in cal/cm², or an Arc Protection Class. Every arc-rated garment is flame retardant; most flame-retardant garments have no arc rating. If the label has no number, it has not been tested for this hazard.",
      },
      {
        q: "What can we wear underneath?",
        a: "Natural fibres — cotton, wool — or inherently flame-resistant fabric, and nothing else. Polyester, nylon and most performance base layers melt at temperatures well below what an arc produces, and molten fabric bonded to skin is far harder to treat than a burn. A non-melting underlayer also adds usable protection, because the air gap between layers is part of what stops the heat.",
      },
      {
        // TODO(client): confirm whether arc flash studies are referred to a
        // named partner, and name them here if so.
        q: "How do we pick the cal/cm² rating?",
        a: "From the incident energy calculated for that task at that working distance, with the garment rating above it — not from the system voltage, which on its own tells you very little about the energy an arc would release. If no arc flash study exists for the installation, that study is the correct next purchase, ahead of the clothing.",
      },
    ],
  },

  /* ================================================================== */
  {
    slug: "height-access",
    heroTagline:
      "Permanent lifelines and anchor systems for the routes people climb every week.",
    intro: [
      "Fall protection sold as loose equipment solves a one-off job. It does not solve the ladder to the gantry that four people climb every shift, the roof that gets walked twice a month for gutter clearing, or the tank car that has to be topped from above. Those are routes, used repeatedly, and a route deserves a fixed system: a lifeline or rail the user clips into at the bottom and stays attached to all the way up and along.",
      "The engineering question is what the structure can carry. Every anchor imposes a load on whatever it is bolted to, and an arrested fall multiplies that considerably; a system rated to EN 795 is only as good as the steel or concrete behind it. That is why height access is specified from the structure outwards — anchor type, line type, number of simultaneous users, energy absorber — rather than from a catalogue page inwards.",
    ],
    hazards: [
      "Workers free-climbing a caged ladder because the only alternative is unclipping and re-clipping at every rung.",
      "Anchor points fixed to cladding, purlins or handrail that were never rated to take an arrest load.",
      "Insufficient fall clearance below the working level — the system arrests correctly and the user still strikes the floor.",
      "Horizontal lifelines loaded by more simultaneous users than they were designed and certified for.",
      "Guided-type fall arresters paired with the wrong anchor line — these are matched systems and are not interchangeable between manufacturers.",
      "Certification lost after installation, leaving no proof of rating when an auditor or insurer asks.",
    ],
    approach: [
      {
        title: "Assess the route and the structure",
        body: "We look at the actual path a person takes, how often, and what they carry — then at what the anchors can be fixed to. Fall clearance is measured, not assumed: lanyard length, deceleration distance, harness stretch and a safety margin all have to fit between the anchor and the nearest thing to hit.",
      },
      {
        title: "Specify a matched, certified system",
        body: "Line, traveller, energy absorber, anchors and connectors get specified as one certified system from one manufacturer, sized to the number of simultaneous users. Where the fixed system has gaps, we specify the personal equipment — harness, retractable, connectors — that bridges them without inventing an unrated combination.",
      },
      {
        title: "Supply with the certification retained",
        body: "Systems are supplied with the documentation the installation and every subsequent inspection will be judged against, and we set up the periodic examination schedule. Fixed systems fail audits far more often on missing paperwork than on missing hardware.",
      },
    ],
    standards: [
      {
        code: "EN 795",
        meaning:
          "Anchor devices, Classes A to E — the class tells you how it is fixed and whether it is permanent or portable.",
      },
      {
        code: "EN 353-1",
        meaning:
          "Guided type fall arresters on a rigid anchor line — the rail-and-traveller system on a fixed ladder.",
      },
      {
        code: "EN 353-2",
        meaning:
          "Guided type fall arresters on a flexible anchor line — the cable or rope equivalent.",
      },
      {
        code: "EN 360",
        meaning:
          "Retractable type fall arresters, which limit free-fall distance where clearance is tight.",
      },
      {
        code: "EN 358",
        meaning:
          "Work positioning systems — holds the user in place to work, and is never a fall arrest device on its own.",
      },
      {
        code: "IS 3521",
        meaning:
          "The Indian standard for industrial safety belts and harnesses, frequently specified in Indian tenders alongside EN references.",
      },
    ],
    relatedCategorySlugs: [
      "lifeline-system",
      "horizontal-and-inclined-fall-arrest",
      "vertical-fall-arrest",
      "works-in-suspension",
      "anchor",
      "fall-arrest-system",
    ],
    faq: [
      {
        q: "How much clearance do we need below the work platform?",
        a: "Add it up rather than estimating: the free-fall distance before arrest, the deceleration distance as the energy absorber deploys, the stretch in the harness and the height of the user below their attachment point, plus a clear margin. A standard shock-absorbing lanyard often needs around six metres beneath the anchor. Where you have less, that is the case for a retractable to EN 360, which arrests in a far shorter distance.",
      },
      {
        q: "Can we mix a fall arrester from one maker with a line from another?",
        a: "No. Guided-type fall arresters to EN 353-1 and EN 353-2 are certified as a matched pair with their specific anchor line — the locking action depends on the exact rope or rail diameter, construction and stiffness. A traveller from a different manufacturer may run freely and simply not lock. Replacement parts have to come from the system's own maker.",
      },
      {
        q: "How often should a fixed lifeline system be inspected?",
        a: "At least annually by a competent person, plus a user pre-use check every time it is clipped into, and always after it has arrested a fall — that system is out of service until examined. Manufacturers commonly specify a shorter interval in corrosive or coastal service, which covers a lot of sites in Kachchh. We schedule the interval with you so it does not drift.",
      },
    ],
  },

  /* ================================================================== */
  {
    slug: "cryo-cold-protection",
    heroTagline:
      "Liquid nitrogen, LNG and cold stores — where a splash freezes tissue on contact.",
    intro: [
      "Cryogenic handling is a small part of most sites and an outsized share of their injuries. Liquid nitrogen boils at −196 °C, LNG at around −162 °C, and either will destroy tissue on contact faster than a person can pull away. The classic injury is not a dramatic spill but a splash that runs into a glove cuff or a boot top and cannot get out — the liquid is trapped against skin by the very equipment meant to protect it.",
      "That drives an unusual design rule: cryogenic gloves and aprons are loose, and cuffs are worn over the sleeve, not tucked in, so a splash sheds instead of pooling. It also separates two hazards that get bought as one. Cryogenic protection is contact protection against extreme cold for seconds at a time; cold-store clothing is thermal insulation against a moderately cold environment for hours. They are tested to different standards and one does not substitute for the other.",
    ],
    hazards: [
      "Cryogenic liquid running into a gauntlet cuff or boot top and held against skin, causing a deeper burn than a direct splash.",
      "Ordinary thermal or leather gloves used at cryogenic temperatures — they absorb the liquid and hold it in place.",
      "Asphyxiation from boil-off in a poorly ventilated space: one litre of liquid nitrogen becomes roughly 700 litres of gas and displaces oxygen without any warning smell.",
      "Cold-embrittled carbon steel and plastic components failing under normal handling loads after cryogenic exposure.",
      "Reduced dexterity in bulky cold-store gloves leading to drops and secondary injury.",
      "Eyes and face unprotected while decanting or connecting transfer lines — where splashes actually occur.",
    ],
    approach: [
      {
        title: "Assess exposure type and duration",
        body: "We separate the two questions: is this contact with cryogenic liquid, or extended work in a cold environment? Decanting nitrogen for ten minutes a day and picking orders in a −25 °C store all shift need entirely different equipment, and sites frequently buy one when they needed the other.",
      },
      {
        title: "Specify for shedding and for hours",
        body: "For cryogenic contact: loose gauntlets worn over the sleeve, face and eye protection, apron and spats so nothing can enter a cuff or boot. For cold environments: rated ensembles chosen against the actual temperature and the metabolic rate of the work, plus footwear with cold insulation, because standing on a cold floor drives heat loss more than most buyers expect.",
      },
      {
        title: "Supply across the size range",
        body: "Cold protection fails on fit more than on rating — a glove that cannot be shed instantly is a hazard in itself, and an ensemble too tight to layer under is not worn. We supply the full size range and the consumables, and we will say plainly when a requirement calls for a cryogenic apron rather than the cold-store jacket that was asked for.",
      },
    ],
    standards: [
      {
        code: "EN 511",
        meaning:
          "Protective gloves against cold — three performance numbers: convective cold, contact cold, water permeability.",
      },
      {
        code: "EN 342",
        meaning:
          "Ensembles for protection against cold, tested as a complete outfit for environments below −5 °C.",
      },
      {
        code: "EN 14058",
        meaning:
          "Garments for protection in cool environments, for conditions above the EN 342 threshold.",
      },
      {
        code: "EN ISO 20345",
        meaning:
          "Safety footwear — look for the CI marking, which is the cold-insulation test for the sole complex.",
      },
      {
        code: "EN 166",
        meaning:
          "Personal eye protection — the base standard for the visors and goggles worn while decanting.",
      },
      {
        code: "EN ISO 13688",
        meaning:
          "General requirements for protective clothing — sizing, marking, innocuousness, applied on top of the specific standards.",
      },
    ],
    relatedCategorySlugs: [
      "cryo-protection",
      "chemical-hand-glove",
      "goggles",
      "face-shield",
    ],
    faq: [
      {
        q: "Why are cryogenic gloves loose rather than close-fitting?",
        a: "So they can be thrown off instantly, and so a splash sheds rather than being trapped. A close-fitting or tucked-in glove holds cryogenic liquid against the skin, which produces a far deeper injury than the same splash landing on a loose gauntlet that can be shaken free. For the same reason the cuff goes over the sleeve, never inside it.",
      },
      {
        q: "Will cold-store clothing work for handling liquid nitrogen?",
        a: "No. Cold-store clothing is insulation, designed to slow heat loss over hours in a cold environment; it is tested to EN 342 or EN 14058 for exactly that. Cryogenic handling is brief contact with a liquid hundreds of degrees below zero, and needs equipment designed to shed it. The two hazards look similar on a requisition and are not interchangeable.",
      },
      {
        q: "Do we need to worry about oxygen levels as well?",
        a: "Yes, and it is the hazard most often missed. Cryogenic liquids expand enormously as they boil off — nitrogen by roughly 700 times — and the resulting gas displaces oxygen silently. In any enclosed or poorly ventilated area where cryogens are handled or stored, oxygen depletion monitoring belongs in the specification alongside the gloves and the visor.",
      },
    ],
  },

  /* ================================================================== */
  {
    slug: "heat-protection",
    heroTagline:
      "Furnaces, ladles and molten metal — radiant heat, splash and the approach that has to be survivable.",
    intro: [
      "Heat is not one hazard, and the equipment that stops one form of it can be useless against another. Radiant heat from a furnace door arrives as infrared and is reflected by an aluminised surface. Molten metal splash is a contact hazard that has to run off before it burns through. Convective heat from a flame front, contact heat from a hot workpiece and steam from a leaking line all behave differently again, and each has its own test in the standard.",
      "Aluminised para-aramid dominates the severe end of this work because it addresses the dominant hazard — radiant load — while the aramid substrate handles flame and keeps its strength when hot. But it is a system: hood, jacket, trousers or long coat, gloves, spats and a gold-coated furnace observation visor. A single unprotected gap at the wrist or ankle is where the injury happens, no matter how well rated the coat is.",
    ],
    hazards: [
      "Radiant load from an open furnace door that makes the approach untenable long before anything touches the worker.",
      "Molten metal splash lodging in a fold, cuff or pocket flap and burning through while it sits there.",
      "Heat stress in the worker inside the suit — on an Indian summer shift this is the more likely casualty, and it is caused by the protection itself.",
      "Aluminised surfaces degraded by soot, oil or repeated laundering, losing the reflectivity the rating depends on.",
      "Furnace observation done through an unfiltered shield, exposing eyes to infrared and glare.",
      "Gaps at wrist, ankle and neck where the system was assembled from separately bought parts that do not overlap.",
    ],
    approach: [
      {
        title: "Assess which heat, and for how long",
        body: "We identify the dominant mode — radiant, splash, contact, convective — and the realistic exposure time and approach distance. That determines whether this is a proximity suit, an aluminised long coat, or flame-resistant workwear with a splash apron, and it is the step that most often changes the answer from what was originally requested.",
      },
      {
        title: "Specify the system with no gaps",
        body: "Garments are specified as an overlapping set: hood over jacket, gauntlets over sleeves, spats over boots, visor rated for the furnace being watched. We check the EN ISO 11612 letter codes against the actual hazard rather than treating the standard as a single pass mark.",
      },
      {
        title: "Supply, and plan the heat stress",
        body: "We supply the full kit sized to the crew, plus the replacement schedule — aluminised fabric is consumable in a way plain workwear is not. Where exposure is long, we will say so and recommend the work-rest cycling and cooling that the suit itself makes necessary.",
      },
    ],
    standards: [
      {
        code: "EN ISO 11612",
        meaning:
          "Clothing to protect against heat and flame, with letter codes A–F for flame spread, convective, radiant, molten aluminium, molten iron and contact heat.",
      },
      {
        code: "EN 1486",
        meaning:
          "Protective clothing for firefighters — the reflective proximity suits used at the highest radiant loads.",
      },
      {
        code: "EN ISO 6942",
        meaning:
          "The radiant heat test method itself — where the code C1 to C4 rating on a garment comes from.",
      },
      {
        code: "EN 407",
        meaning:
          "Gloves against thermal risks, with six separately rated performance numbers rather than one score.",
      },
      {
        code: "EN ISO 11611",
        meaning:
          "Clothing for welding and allied processes, Class 1 and Class 2 by spatter and radiant exposure.",
      },
      {
        code: "EN 166 / EN 171",
        meaning:
          "Eye protection and its infrared filter scale — what a furnace observation visor is actually rated by.",
      },
    ],
    relatedCategorySlugs: [
      "heat-x",
      "aluminized-para-aramid",
      "fire-proximity",
      "heat-protection-body-protection",
      "d3e3",
      "furnace-observation",
    ],
    faq: [
      {
        q: "What do the letters after EN ISO 11612 mean?",
        a: "They are the hazards the garment was actually tested against, and you should read them rather than the standard number alone. A is limited flame spread, B convective heat, C radiant heat, D molten aluminium splash, E molten iron splash, F contact heat — each with a performance level. A garment certified A1+B1+C1 offers nothing established about molten metal splash. Match the letters to your hazard, not the headline.",
      },
      {
        q: "How long does aluminised clothing last?",
        a: "Far less than plain workwear, and it degrades invisibly. The aluminised surface loses reflectivity as it is contaminated with soot and oil, scratched, or laundered against the manufacturer's instructions — and reflectivity is the entire mechanism. Treat it as consumable, inspect for dulling and delamination before each use, and budget for replacement rather than waiting for visible failure.",
      },
      {
        q: "Our people overheat inside the suits. What can we do?",
        a: "Recognise it as a real risk rather than a comfort complaint — in a hot climate the heat stress casualty is more likely than the burn casualty. The levers are exposure time, work-rest cycling, cooling between entries, hydration, and specifying the lightest garment that still covers the assessed hazard. Over-specifying protection makes this worse, which is why we start from the actual radiant load rather than defaulting to the heaviest option.",
      },
    ],
  },

  /* ================================================================== */
  {
    slug: "inherent-flame-retardant-clothing",
    heroTagline:
      "Protection woven into the fibre — so it cannot be washed out, worn off or laundered away.",
    intro: [
      "There are two ways to make workwear flame resistant. A treated fabric is ordinary cotton with a flame-retardant chemistry applied to it; an inherent fabric is spun from fibres that are flame resistant in their own chemistry, such as aramids or modacrylics. Both can pass the same test on day one. The difference shows up at wash fifty, in an industrial laundry, on a site where the water is hard and the detergent is whatever was available.",
      "For plants running flash fire or arc risk — refineries, tank farms, gas handling, electrical maintenance — inherent fabric is usually the better economics as well as the safer choice, because the protection cannot be depleted by laundering and the garment life is longer. It also carries the daily-wear argument: this is clothing people put on for a whole shift in Indian heat, and comfort determines whether it is actually worn closed and tucked in, which is what the rating assumes.",
    ],
    hazards: [
      "Treated fabric losing its finish after repeated industrial laundering, so the garment looks serviceable and no longer performs.",
      "Polyester or nylon undergarments worn beneath compliant outerwear, melting onto skin in a flash fire.",
      "Garments worn open, untucked or with sleeves rolled because the fabric is too hot for the climate — the rating assumes the garment is closed.",
      "Non-FR high-visibility vests, rainwear or coveralls layered over FR clothing, adding a fuel source outside the protection.",
      "Contamination with oil or solvent, which will burn on the surface of a garment that itself will not.",
      "Repairs made with ordinary thread, patches or badges, creating an ignition path through a certified garment.",
    ],
    approach: [
      {
        title: "Assess the risk and the shift",
        body: "Flash fire, arc, welding spatter and general spark exposure need different specifications, and a garment worn eight hours in 40 °C heat has a comfort requirement that is a safety requirement in disguise. We look at both, along with your laundering arrangements — which decide inherent versus treated more often than anything else.",
      },
      {
        title: "Specify the whole wardrobe",
        body: "Outerwear, base layer, high-visibility and rainwear all have to be compatible. We specify FR base layers and FR high-visibility rather than leaving those to general stores, because a non-FR layer anywhere in the stack undoes the system — and we set the fabric weight against the climate, not the catalogue default.",
      },
      {
        title: "Supply, size and sustain",
        body: "Supplied across a full size range including women's fits, with the certification documented per batch for your audit file. We handle repeat supply on a rotation schedule and provide the repair and laundering guidance that keeps certification valid through the garment's life.",
      },
    ],
    standards: [
      {
        code: "EN ISO 11612",
        meaning:
          "Clothing to protect against heat and flame — the core standard, read together with its A–F letter codes.",
      },
      {
        code: "EN ISO 14116",
        meaning:
          "Limited flame spread, Index 1 to 3 — for garments where flame spread is the only heat hazard.",
      },
      {
        code: "EN ISO 11611",
        meaning:
          "Clothing for welding and allied processes, Class 1 for light spatter and Class 2 for heavy.",
      },
      {
        code: "IEC 61482-2",
        meaning:
          "Arc-rated garment requirements, where the same clothing also has to handle electrical arc exposure.",
      },
      {
        code: "EN 1149-5",
        meaning:
          "Electrostatic dissipative performance, needed wherever the garment is worn in a flammable atmosphere.",
      },
      {
        code: "EN ISO 20471",
        meaning:
          "High-visibility clothing — specify the FR-compatible version, never a standard vest over FR workwear.",
      },
    ],
    relatedCategorySlugs: [
      "flash-knight",
      "adg",
      "mechanical-workwear",
      "chemical-protection",
    ],
    faq: [
      {
        q: "Inherent or treated — does it actually matter?",
        a: "It matters most over the garment's life. Both can meet the same standard when new. A treated fabric relies on a chemical finish that depletes with washing, hard water and the wrong detergent, and there is no field test that tells a supervisor it has gone. Inherent fabric is flame resistant because of what the fibre is, so the protection lasts as long as the garment does. Where laundering is industrial, frequent or outsourced, inherent is the safer specification and often the cheaper one per year of service.",
      },
      {
        q: "Can people wear their own t-shirts underneath?",
        a: "Only if they are natural fibre or FR — and controlling this is a real operational problem, because the base layer is the item most likely to be personal. Polyester and nylon melt at temperatures a flash fire passes through instantly, and melted synthetic bonded to skin is a far worse injury than a burn. The workable answer is to issue FR base layers rather than to rely on a rule.",
      },
      {
        q: "What happens if a garment gets oil-soaked?",
        a: "It comes out of service until it is properly cleaned. The fabric will not sustain a flame, but the hydrocarbon on its surface certainly will, and it burns right against the wearer. This applies to inherent and treated fabric equally — flame resistance is a property of the fibre, not a force field over whatever is on it. Contaminated garments need laundering to the manufacturer's instructions, and replacement where the contamination will not come out.",
      },
    ],
  },
];
