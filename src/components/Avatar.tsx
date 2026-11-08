import { still, versioned } from "../lib/media";

interface Props {
  /** An avatar still id from media/shots.json. */
  id: string;
  alt: string;
  /** Displayed diameter in CSS pixels. */
  size?: number;
  className?: string;
}

/** An archetype figure as the app draws it, captured by `npm run media`. */
export default function Avatar({ id, alt, size = 112, className = "" }: Props) {
  const shot = still(id);
  const sources = shot.variants.map((variant) => ({
    ...variant,
    file: versioned(variant.file, shot.capturedAt),
  }));

  return (
    <img
      className={`rounded-full bg-art-ground object-cover ${className}`}
      src={sources[0].file}
      srcSet={sources.map((source) => `${source.file} ${source.width}w`).join(", ")}
      sizes={`${size}px`}
      width={size}
      height={size}
      style={{ width: size, height: size }}
      alt={alt}
      loading="lazy"
      decoding="async"
    />
  );
}
