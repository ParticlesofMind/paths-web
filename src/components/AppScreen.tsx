import { still, versioned } from "../lib/media";
import Device, { type DeviceTilt } from "./Device";

interface Props {
  /** A still id from media/shots.json. */
  id: string;
  alt: string;
  /** Displayed width in CSS pixels. */
  width?: number;
  eager?: boolean;
  tilt?: DeviceTilt;
  className?: string;
}

/** A real screenshot from the app, captured by `npm run media`, on the device it was taken on. */
export default function AppScreen({ id, alt, width = 280, eager = false, tilt, className = "" }: Props) {
  const shot = still(id);
  const sources = shot.variants.map((variant) => ({
    ...variant,
    file: versioned(variant.file, shot.capturedAt),
  }));

  return (
    <Device width={width} tilt={tilt} model={shot.device} aspect={shot.width / shot.height} className={className}>
      <img
        className="app-screen"
        src={sources[0].file}
        srcSet={sources.map((source) => `${source.file} ${source.width}w`).join(", ")}
        sizes={`${width}px`}
        width={shot.width}
        height={shot.height}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
      />
    </Device>
  );
}
