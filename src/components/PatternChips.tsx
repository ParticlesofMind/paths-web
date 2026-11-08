import type { Pattern } from "../lib/art";
import AppIcon from "./AppIcon";

interface Props {
  patterns: Pattern[];
  /** How many to show before the rest are counted. */
  limit?: number;
}

/** Ready-made patterns from the app, each with the icon it has there. */
export default function PatternChips({ patterns, limit = 4 }: Props) {
  const shown = patterns.slice(0, limit);
  const rest = patterns.length - shown.length;

  return (
    <ul className="flex flex-wrap gap-2 text-sm">
      {shown.map((pattern) => (
        <li key={pattern.name} className="flex items-center gap-1.5 rounded-full border border-mist px-3 py-1">
          <AppIcon name={pattern.icon} className="h-4 w-4" />
          {pattern.name}
        </li>
      ))}
      {rest > 0 && <li className="px-1 py-1 text-ink-60">and {rest} more</li>}
    </ul>
  );
}
