// The nine methods: how the app watches a pattern happen, and the proof each
// leaves. From reference/METHODS_OVERVIEW.md, less Learn with Arete, which the
// app retired (the user, 2026-10-05) after that document was written; `steps` restate its section 6,
// "What each method can do today", as a short how-to. `still` is a screenshot id from
// media/shots.json; `clip`, where one exists, is a recording of the method in use
// there, shown in its place. `icon` is the site's choice from the app's
// icon set; the app itself gives methods no icon.

export interface Method {
  id: string;
  /** An icon from the app's set, in public/app/icons. */
  icon: string;
  name: string;
  proof: string;
  /** How to use the method, in the order the user meets it. */
  steps: string[];
  still: string;
  clip?: string;
}

export const methods: Method[] = [
  {
    id: "take-picture",
    icon: "camera",
    name: "Take a picture",
    proof: "A photo",
    steps: [
      "Paths fits the camera guide to the activity: a meal, your living space, or anything else.",
      "Take the photos the activity asks for.",
      "Complete opens once every photo is in.",
    ],
    still: "method-picture",
  },
  {
    id: "register-audio",
    icon: "mic",
    name: "Record audio",
    proof: "A recording",
    steps: [
      "Record, with a live waveform and timer.",
      "Add more recordings if one is not enough.",
      "Play them back, skipping through, before you publish.",
    ],
    still: "method-audio",
    clip: "method-audio-run",
  },
  {
    id: "take-notes",
    icon: "pen-line",
    name: "Take notes",
    proof: "A written note",
    steps: [
      "Write freely, with undo and redo.",
      "Writing verse? Pick the kind of poem first.",
      "Publish the note.",
    ],
    still: "method-notes",
    clip: "method-notes-run",
  },
  {
    id: "draw-painting",
    icon: "palette",
    name: "Draw or paint",
    proof: "A finished drawing",
    steps: [
      "Ask for a prompt if you need somewhere to start.",
      "Draw with brushes, an eraser and text, in layers, over a background or a reference image.",
      "Export the finished piece, or share it.",
    ],
    still: "method-draw",
    clip: "method-draw-run",
  },
  {
    id: "wake-up",
    icon: "alarm-clock",
    name: "Wake up",
    proof: "The alarm, answered",
    steps: [
      "Choose the alarm sound.",
      "Run the checklist: permission, battery, volume. Preview the alarm.",
      "When it rings, answer it.",
    ],
    still: "method-wake",
    clip: "method-wake-run",
  },
  {
    id: "track-motion",
    icon: "footprints",
    name: "Track motion",
    proof: "A route, with distance and pace",
    steps: [
      "Start, and Paths follows your route by GPS.",
      "Distance, speed, steps and calories add up as you go.",
      "Finish, and the route is saved as a map.",
    ],
    still: "method-motion",
  },
  {
    id: "read-books",
    icon: "book",
    name: "Read books",
    proof: "A reading session",
    steps: [
      "Search the Project Gutenberg library and pick a book.",
      "Read chapter by chapter, in the theme and font you like.",
      "Bookmark where you stop. The session is kept, and its summary is your proof.",
    ],
    still: "method-read",
    clip: "method-read-run",
  },
  {
    id: "play-games",
    icon: "grid-3x3",
    name: "Play games",
    proof: "A game result",
    steps: [
      "Choose chess, Go or sudoku.",
      "Play the game through.",
      "The outcome and move count are your proof.",
    ],
    still: "method-games",
    clip: "method-games-run",
  },
];
