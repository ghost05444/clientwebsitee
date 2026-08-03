/**
 * Seed articles.
 *
 * Hand-written buyer-education content, structured rather than MDX so the
 * blog stays a plain data import with no extra build dependency and no
 * runtime markdown parsing. Each body section is a heading plus paragraphs;
 * add a `list` for bulleted runs.
 *
 * Dates are ISO and treated as publication dates.
 */

export type PostSection = {
  heading: string;
  paragraphs: string[];
  list?: string[];
};

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  /** ISO date, YYYY-MM-DD. */
  date: string;
  /** Whole minutes, rounded from ~220 wpm. */
  readingTime: number;
  /** Short label for the card and the article eyebrow. */
  topic: string;
  body: PostSection[];
};

export const posts: Post[] = [
  /* ================================================================== */
  {
    slug: "is-2925-vs-en-397-industrial-helmet",
    title: "IS 2925 or EN 397? Choosing an industrial helmet that actually fits the site",
    excerpt:
      "Two standards, two different assumptions about what will hit the wearer. Here is what each one tests, where they diverge, and how to specify a helmet without over- or under-buying.",
    date: "2026-03-12",
    readingTime: 4,
    topic: "Head protection",
    body: [
      {
        heading: "Two standards, two different questions",
        paragraphs: [
          "Almost every industrial helmet sold in India carries one of two marks: IS 2925, the Indian standard for industrial safety helmets, or EN 397, its European counterpart. Buyers often treat them as interchangeable badges of quality. They are not. They ask overlapping but genuinely different questions about how a helmet behaves when something goes wrong, and the differences matter most in exactly the situations where a helmet earns its keep.",
          "Both standards test shock absorption from a mass dropped onto the crown, and both test resistance to penetration by a pointed striker. That common core is why a helmet meeting either standard will handle the classic hazard — a tool or fixing dropped from a level above. The divergence starts once you move away from a clean vertical impact.",
        ],
      },
      {
        heading: "What EN 397 adds",
        paragraphs: [
          "EN 397 carries a set of optional requirements that a manufacturer can elect to meet and mark on the shell. These are the specifications worth reading, because they are where a helmet is matched to a particular site rather than to a generic hazard:",
        ],
        list: [
          "−20 °C or −30 °C — impact performance retained at low temperature, relevant for cold stores and cryogenic areas.",
          "+150 °C — performance retained at high temperature, which matters far more than buyers expect near furnaces and in Indian summer roof work.",
          "440 V a.c. — the shell will not conduct a brief accidental contact with a live conductor. This is not a substitute for electrical PPE.",
          "LD — lateral deformation, meaning the shell resists a crushing load from the side rather than only from above.",
          "MM — molten metal splash, for foundry and steel work.",
        ],
      },
      {
        heading: "The chinstrap difference nobody reads",
        paragraphs: [
          "The single most consequential clause in EN 397 is one most buyers never look at: the chinstrap is required to release between 150 N and 250 N. It is designed to fail. The reasoning is that a helmet snagged on structure or machinery while the wearer is moving becomes a strangulation hazard, and the standard decides that risk outweighs the benefit of keeping the helmet on.",
          "That is the correct trade-off for general industry, and the wrong one for work at height, where losing the helmet mid-fall is the greater danger. If your people are working on a lifeline or in rope access, a helmet to EN 12492 — the mountaineering-derived standard, with a chinstrap that must hold rather than release — is usually the right specification. Specifying an EN 397 helmet for height work is one of the most common mismatches we see.",
        ],
      },
      {
        heading: "How to specify without over-buying",
        paragraphs: [
          "Start from the hazard, not the price list. For general plant, warehousing and construction where the risk is a dropped object, either standard on a well-fitting shell with a ratchet harness is sound, and the money is better spent on fit and comfort than on optional clauses you do not need. A helmet that is uncomfortable in 40 °C heat gets pushed back on the head, and a helmet on the back of the head protects nothing.",
          "Add the optional marks where the site genuinely calls for them: high temperature near furnaces, lateral deformation where there is a crush risk from moving plant, electrical where switchgear is involved. Move to EN 12492 for work at height. And check the shell's date of manufacture — the moulding is stamped inside, and thermoplastic shells degrade with UV whether or not they have ever been struck.",
        ],
      },
      {
        heading: "The short version",
        paragraphs: [
          "IS 2925 and EN 397 both cover the everyday dropped-object hazard competently. Read the optional EN 397 marks to match the helmet to your specific site conditions, and treat the releasing chinstrap as the deciding factor: general industry keeps it, work at height needs a helmet that does not have it. If you are unsure which applies to a particular crew, send us the job and we will work through it.",
        ],
      },
    ],
  },

  /* ================================================================== */
  {
    slug: "reading-en-388-glove-markings",
    title: "Reading EN 388 glove markings without guessing",
    excerpt:
      "Four digits and two letters on the cuff carry more information than most buyers extract. A walk through each position, and the 2016 change that made older cut ratings misleading.",
    date: "2026-04-08",
    readingTime: 5,
    topic: "Hand protection",
    body: [
      {
        heading: "The pictogram and what sits under it",
        paragraphs: [
          "Hand injuries are the most common lost-time injury in most manufacturing operations, and gloves are the most frequently bought PPE item by volume. They are also the item most often bought on price alone, because the marking that would let a buyer compare two products properly is treated as decoration.",
          "Under the little anvil-and-hammer pictogram of EN 388 sits a string of up to four digits and two letters. Each position is a separate test with its own scale. A glove marked 4X43C is not 'better' than one marked 3121A in any general sense — it is better at some things and untested at another, and which of those matters depends entirely on the job.",
        ],
      },
      {
        heading: "Position by position",
        paragraphs: [
          "Read left to right. The first four positions are digits, the fifth and sixth are letters:",
        ],
        list: [
          "1 — Abrasion, 0 to 4. Cycles of sandpaper before the fabric wears through. This is the number that predicts how long the glove lasts, not how safe it is.",
          "2 — Coupe cut, 0 to 5. A rotating circular blade under light load. Increasingly reported as X, for good reason — see below.",
          "3 — Tear, 0 to 4. Force needed to propagate a tear once one has started.",
          "4 — Puncture, 0 to 4. Force needed to push a blunt stylus through. Note the stylus is deliberately blunt: this does not predict resistance to a needle or a fine splinter.",
          "5 — TDM cut, A to F. The ISO 13997 test, using a straight blade under increasing load. This is the meaningful cut rating.",
          "6 — Impact, P or absent. Pass or nothing. Only present on gloves with knuckle protection.",
        ],
      },
      {
        heading: "Why you keep seeing X in the cut position",
        paragraphs: [
          "The 2016 revision of EN 388 addressed a real problem with the original coupe test. That test runs a circular blade back and forth across the sample, and when the material is genuinely cut-resistant — glass fibre or steel-cored yarns, which are what high-cut gloves are made of — the blade itself blunts during the test. A blunted blade takes more cycles to cut through, and the glove scores higher for a reason that has nothing to do with how it performs against a sharp edge.",
          "So the standard added the TDM test at position five, which uses a fresh blade section on every pass and reports the load in newtons needed to cut through at 20 mm of travel. When the coupe blade blunts during testing, the result is invalid and the manufacturer reports X in position two. An X there is not a gap in the data or a failure — it is the honest answer, and the letter at position five is where you should be looking.",
          "The practical consequence: if you are comparing gloves bought before and after 2016, or comparing a cheap import quoting only a coupe digit against a glove quoting a TDM letter, you are not comparing like with like. For anything where cut is the actual hazard, specify the letter.",
        ],
      },
      {
        heading: "Matching the marking to the work",
        paragraphs: [
          "For general handling, assembly and warehouse work, abrasion is what determines glove life and therefore cost per shift; a 3 or 4 in the first position with a comfortable coating will serve better than an over-specified cut glove that gets removed for dexterity.",
          "For sheet metal, glass, blade changes and anything with a machined edge, the TDM letter is the specification. Level C covers a great deal of general metalwork; D and E are for handling stock with genuinely sharp edges. Going higher than the hazard requires costs dexterity, and a glove removed to do a fiddly task protects nobody.",
          "And note what EN 388 does not cover at all: chemical permeation is EN 374, thermal risk is EN 407, and cold is EN 511. A glove can score 4X43C and offer no established protection whatsoever against the solvent your operators are handling.",
        ],
      },
      {
        heading: "The short version",
        paragraphs: [
          "Read position one for how long the glove lasts and position five for how well it resists a sharp edge. Treat X in position two as information rather than an omission. And check that EN 388 is even the right standard for the hazard before comparing numbers under it — a chemical or heat exposure needs a different pictogram entirely.",
        ],
      },
    ],
  },

  /* ================================================================== */
  {
    slug: "fall-protection-harness-lanyard-anchor",
    title: "Fall protection basics: the harness, the lanyard and the anchor are one system",
    excerpt:
      "Three components, bought separately, that only work together. What each one does, the clearance calculation nobody runs, and why the anchor is usually the weakest link.",
    date: "2026-05-20",
    readingTime: 6,
    topic: "Fall protection",
    body: [
      {
        heading: "Three parts, one system",
        paragraphs: [
          "A personal fall arrest system has three components: something that holds the person, something that connects them to the structure, and something on the structure to connect to. Each is bought separately, often from different suppliers, and each is frequently specified without reference to the other two. That is where most of the real-world failures in this category come from — not from a component breaking, but from three sound components assembled into an unsound system.",
          "It is worth being precise about what the system is for. It does not prevent a fall. It arrests one that has already happened, limits the force transmitted to the body while doing so, and leaves the person hanging in a survivable position until rescue. Preventing the fall in the first place — a guardrail, a restraint lanyard too short to reach the edge — is always the better engineering answer where it is available.",
        ],
      },
      {
        heading: "The harness: full body, and only full body",
        paragraphs: [
          "Fall arrest requires a full body harness to EN 361. A waist belt is not fall arrest equipment and has not been for decades: arresting a fall on a belt concentrates the entire deceleration force on the abdomen and spine, and the injuries are severe. Belts to EN 358 exist for work positioning — holding someone in place so they can work with both hands — and are used in addition to a harness, never instead of one.",
          "The attachment point matters as much as the harness. The dorsal D-ring between the shoulder blades is the standard fall arrest attachment because it keeps the body upright during arrest and after it, with the airway clear. Sternal attachments are also rated for arrest on many harnesses. Side D-rings are work positioning only, and the ventral attachment is for rope access. Clipping a fall arrest lanyard to a side D-ring is a common and dangerous error.",
          "Look also for EN 1497, the rescue attachment. It is a small extra cost at purchase and the difference between a controlled rescue lift and an improvised one.",
        ],
      },
      {
        heading: "The lanyard: the energy absorber is the point",
        paragraphs: [
          "An unabsorbed fall of two metres onto a fixed lanyard generates forces well beyond what a human body tolerates. The shock-absorbing lanyard to EN 355 solves this by tearing a stitched pack in a controlled way, extending as it does so and limiting the arrest force to a survivable level — the standard caps it at 6 kN.",
          "That extension is the part buyers forget. The absorber can add well over a metre to the length of the fall, and that metre has to exist below the worker. Where it does not, the answer is a retractable type fall arrester to EN 360, which pays out and locks like a seat belt and arrests within a much shorter distance.",
          "A shock absorber that has deployed is finished. The tear pack is single-use, the visible extension is the indicator, and the lanyard is scrap. So is any harness that has arrested a fall, regardless of how it looks.",
        ],
      },
      {
        heading: "The clearance calculation",
        paragraphs: [
          "This is the calculation that most sites never run, and it is the one that decides whether the system works. Below the anchor point you need, added together: the length of the lanyard, the full deployment of the energy absorber, the height of the worker below their own attachment point, the stretch in the harness under load, and a safety margin so nobody arrives at the floor with millimetres to spare.",
          "For a standard two-metre shock-absorbing lanyard that total commonly lands around six metres. If your gantry is four metres above a concrete floor, that system will arrest the fall perfectly and the worker will still hit the ground. A retractable, arresting in a fraction of the distance, is the correct specification — and the calculation, not the catalogue, is what tells you so.",
        ],
      },
      {
        heading: "The anchor: the part that fails",
        paragraphs: [
          "The anchor is where field failures concentrate, because it is the only component people improvise. Handrails, scaffold tube, pipework, cable tray and ducting all feel solid to a hand and none of them were designed for the several kilonewtons an arrested fall delivers. An anchor point needs to be rated, to EN 795, and the class tells you what kind it is — from a permanently installed structural anchor through to a Class B portable device such as a tripod.",
          "Position matters as much as rating. An anchor above the worker minimises free-fall distance; an anchor at or below foot level allows a longer fall and introduces swing. A pendulum swing into structure causes serious injury even when the arrest itself works exactly as designed, and it is entirely a consequence of where the anchor was placed.",
        ],
      },
      {
        heading: "And the rescue plan",
        paragraphs: [
          "A successful arrest leaves someone suspended, and suspension is itself dangerous — leg straps restrict blood return, and a conscious worker can deteriorate within minutes. Rescue provision is part of the system, not an afterthought: named people, equipment stored at the work rather than in central stores, and a plan that does not begin with waiting for an external service. If the plan has never been timed as a drill, it is not yet a plan.",
        ],
      },
    ],
  },

  /* ================================================================== */
  {
    slug: "choosing-fire-extinguisher-class-factory-floor",
    title: "Choosing the right fire extinguisher class for a factory floor",
    excerpt:
      "Fire classes, the extinguishing media that match them, and the three mistakes that turn a small fire into a large one — including the water extinguisher near the switchboard.",
    date: "2026-06-30",
    readingTime: 5,
    topic: "Fire safety",
    body: [
      {
        heading: "Classes describe the fuel, not the size",
        paragraphs: [
          "Fire classification is about what is burning. Get the class wrong and the extinguisher will, at best, do nothing; at worst it will spread the fire or electrocute the person holding it. On a mixed factory floor several classes are present within metres of each other, which is why extinguisher selection is a siting exercise rather than a purchasing one.",
        ],
        list: [
          "Class A — ordinary combustibles: wood, paper, textiles, packaging, most plastics.",
          "Class B — flammable liquids: solvents, paint, petrol, oils that are liquid at room temperature.",
          "Class C — flammable gases: LPG, methane, acetylene.",
          "Class D — combustible metals: magnesium, aluminium swarf, titanium, sodium.",
          "Class F — cooking oils and fats, in canteens and staff kitchens.",
          "Electrical fires have no class of their own; the risk is conductivity back to the operator, which restricts which media may be used.",
        ],
      },
      {
        heading: "Matching media to class",
        paragraphs: [
          "Water is the cheapest and most effective medium for Class A and is the wrong answer for almost everything else. It conducts, so it is disqualified anywhere near live electrical equipment, and it causes burning liquid to spread and splash rather than go out.",
          "Foam covers A and B, blanketing a liquid surface to cut off oxygen, and is the sensible choice around solvent stores and decanting areas. Dry powder is the broadest — A, B and C, and safe on electrical equipment — which is why it dominates general industrial siting. Its drawback is the mess: a discharged powder extinguisher inside a machine shop or a control room causes contamination damage that can exceed the fire damage.",
          "Carbon dioxide leaves no residue, which makes it the standard choice for electrical equipment, control panels and server rooms. It works by displacing oxygen, so it is poor in open or draughty areas and genuinely dangerous in a confined space. The horn also becomes extremely cold in use, and untrained users grab it.",
          "Wet chemical is specific to Class F. Cooking oil at temperature will re-ignite as soon as a conventional agent disperses; wet chemical saponifies the surface and stops that happening. Class D fires need a specialist powder matched to the specific metal — no general-purpose extinguisher addresses them.",
        ],
      },
      {
        heading: "Three mistakes worth checking for today",
        paragraphs: [
          "The first is a water or foam extinguisher sited near a switchboard, motor control centre or charging bay. It happens because extinguishers get mounted where there is wall space rather than where the hazard is, and it stays because nobody walks the floor asking what each unit is actually for.",
          "The second is CO₂ specified as the general-purpose extinguisher for a whole area on the strength of leaving no residue. It has a short throw, disperses quickly outdoors, and does very little on a deep-seated Class A fire in stacked packaging.",
          "The third is powder sited inside occupied control rooms and small enclosed spaces. Discharge in a confined area drops visibility to nothing almost instantly, which matters a great deal when the person now needs to find the exit.",
        ],
      },
      {
        heading: "Siting, access and the human factor",
        paragraphs: [
          "Extinguishers need to be on escape routes and near exits, so that reaching one moves a person towards the way out rather than deeper into the building. They need to be visible, unobstructed, mounted at a height a person can lift them from, and signed so they can be found by someone who does not work in that area.",
          "The equipment is the easy part. Somebody has to be willing to pick it up, know which one to take, and know when not to fight the fire at all. That last judgement — the fire is bigger than one extinguisher, so leave and raise the alarm — saves more lives than any specification decision. It comes from a short, practical briefing, repeated, not from a sticker on the wall.",
        ],
      },
      {
        heading: "The short version",
        paragraphs: [
          "Walk your floor and ask, at each extinguisher, what would burn here. Match the medium to that answer, keep water away from anything live, keep powder out of small occupied rooms, and put wet chemical in the canteen. Then make sure the people who work in each area know which unit is theirs and when to walk away instead.",
        ],
      },
    ],
  },
];

/** Newest first — the order the index and prev/next navigation use. */
export const postsByDate = [...posts].sort((a, b) =>
  b.date.localeCompare(a.date),
);
