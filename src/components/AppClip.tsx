import { clip, versioned } from "../lib/media";
import Device, { type DeviceTilt } from "./Device";

interface Props {
  /** A clip id from media/shots.json. */
  id: string;
  /** What the recording shows, for people who cannot see it. */
  label: string;
  /** Displayed width in CSS pixels. */
  width?: number;
  tilt?: DeviceTilt;
  /** Off when the parent starts and stops the recording itself, as the methods slideshow does. */
  autoplay?: boolean;
  className?: string;
}

/**
 * A real screen recording from the app, captured by `npm run media`, on an
 * iPhone.
 * Layout.astro plays every `video[data-app-clip]` while it is on screen, unless
 * `autoplay` is off.
 */
export default function AppClip({ id, label, width = 280, tilt, autoplay = true, className = "" }: Props) {
  const recording = clip(id);

  return (
    <Device width={width} tilt={tilt} aspect={recording.width / recording.height} className={className}>
      <video
        className="app-clip"
        width={recording.width}
        height={recording.height}
        poster={versioned(recording.poster, recording.capturedAt)}
        aria-label={label}
        muted
        loop
        playsInline
        preload="none"
        {...(autoplay ? { "data-app-clip": true } : {})}
      >
        <source src={versioned(recording.file, recording.capturedAt)} type="video/mp4" />
      </video>
    </Device>
  );
}
