// The core loop, in the order the user meets it. Titles follow the approved App
// Store description (src/content/app-store.json); bodies say what happens at
// each step, from reference/PATHS_APPLICATION_DOCUMENTATION.md sections 2 and 3
// and reference/POINTS_SYSTEM.md. `still` is a
// screenshot id from media/shots.json.

export interface LoopStep {
  id: string;
  title: string;
  body: string;
  still: string;
  stillAlt: string;
}

export const loop: LoopStep[] = [
  {
    id: "plan",
    title: "Plan your routine",
    body: "Pick an activity, such as a run, a drawing or a chapter of a book, and give it days and a time. That is the promise.",
    still: "schedule",
    stillAlt: "The Schedule tab in Paths",
  },
  {
    id: "record",
    title: "Record your practice",
    body: "When the time comes, open the activity and do it. Each one records what you did in its own way: a photo, a recording, a note, a route, a rep count.",
    still: "method-draw",
    stillAlt: "The drawing method in Paths",
  },
  {
    id: "progress",
    title: "See your progress",
    body: "Every completed activity earns points. Points move you along a road through five levels, with badges to earn on the way.",
    still: "progress-badges",
    stillAlt: "A badge in the Progress tab in Paths",
  },
  {
    id: "accountable",
    title: "Stay accountable",
    body: "Completed activities go to a feed your friends see. They can react, comment and give feedback, and you can do the same for them.",
    still: "feed",
    stillAlt: "The Feed tab in Paths",
  },
];
