import type { CSSProperties } from "react";

interface Props {
  /** An icon from the app's set, copied to public/app/icons by `npm run sync`. */
  name: string;
  className?: string;
}

/** One of the app's own icons, drawn in the current text colour. Decorative. */
export default function AppIcon({ name, className = "h-5 w-5" }: Props) {
  return (
    <span
      className={`app-icon ${className}`}
      style={{ "--app-icon": `url("/app/icons/${name}.svg")` } as CSSProperties}
      aria-hidden="true"
    />
  );
}
