// The five archetypes. `excellence` and `anchors` come from
// reference/ARETE_GREEK_ARCHETYPE_FRAMEWORK.md; `description` restates that
// document's interpretation of each archetype in plain words. `levels` are the five Progress
// worlds as built in the app, first to last; for every archetype except Explorer
// they differ from the older proposals in reference/ARCHETYPE_LEVEL_ENVIRONMENTS.md.

export interface Archetype {
  id: "explorer" | "athlete" | "artist" | "culinarian" | "mannequin";
  name: string;
  excellence: string;
  description: string;
  anchors: { term: string; meaning: string }[];
  journey: string;
  levels: string[];
}

export const archetypes: Archetype[] = [
  {
    id: "explorer",
    name: "Explorer",
    excellence: "Inquiry and movement through the world.",
    description:
      "The Explorer follows the road to see where it goes. You visit new places, pay attention to what you find, and come back knowing more than when you left.",
    anchors: [
      { term: "Hodos", meaning: "road, path, way" },
      { term: "Historia", meaning: "inquiry, learning by asking and observing" },
      { term: "Periplous", meaning: "a voyage around, and the return" },
    ],
    journey: "From an open beginning to a high mountain destination.",
    levels: ["Dutch flower fields", "Forest foothills", "Mountain valley", "Exposed ridge", "Alpine summit"],
  },
  {
    id: "athlete",
    name: "Athlete",
    excellence: "Disciplined contest.",
    description:
      "The Athlete trains, then gets tested. It is more than exercise: you show up, push through the hard part, and prove what your body can do, again and again.",
    anchors: [
      { term: "Agōn", meaning: "contest, the arena where excellence is tested" },
      { term: "Andreia", meaning: "courage, steadiness under difficulty" },
      { term: "Gymnasion", meaning: "the training ground" },
    ],
    journey: "Back through the history of sport.",
    levels: ["A modern park", "A Greek field", "A Victorian rowing river", "A medieval tournament", "Edo Japan"],
  },
  {
    id: "artist",
    name: "Artist",
    excellence: "Making beauty through craft.",
    description:
      "The Artist makes things. You do not wait for inspiration: you practice the craft, work the material, and finish something other people can see.",
    anchors: [
      { term: "Technē", meaning: "craft, skill, learned making" },
      { term: "Mousikē", meaning: "the domain of the Muses" },
      { term: "Poiesis", meaning: "bringing something into being" },
    ],
    journey: "One art in each world.",
    levels: ["Painting", "Sculpture", "Architecture", "Music", "Dance and theatre"],
  },
  {
    id: "culinarian",
    name: "Culinarian",
    excellence: "Nourishment, hospitality and measure.",
    description:
      "The Culinarian cooks with care. You learn to feed yourself and others well, in the right measure, until good meals become a way of living.",
    anchors: [
      { term: "Diaita", meaning: "way of living, the ordering of daily life" },
      { term: "Xenia", meaning: "hospitality, the care of receiving others" },
      { term: "Metron", meaning: "measure, the right amount" },
    ],
    journey: "From field to feast.",
    levels: ["An orchard", "A mill", "A market", "A chocolate factory", "A banquet"],
  },
  {
    id: "mannequin",
    name: "Mannequin",
    excellence: "Ordered presentation, grace and self-command.",
    description:
      "The Mannequin treats style as a discipline. It is more than vanity: you choose what you wear and how you carry yourself on purpose, with grace and composure.",
    anchors: [
      { term: "Kosmos", meaning: "order, the beautiful arrangement of a whole" },
      { term: "Charis", meaning: "grace, elegance" },
      { term: "Sōphrosynē", meaning: "self-command, proportion" },
    ],
    journey: "From wardrobe to runway.",
    levels: ["A courtyard", "An atelier", "A promenade", "An editorial court", "A skyline salon"],
  },
];
