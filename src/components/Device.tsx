import type { CSSProperties, ReactNode } from "react";

/** Which way the device faces. `flat` looks straight at the visitor. */
export type DeviceTilt = "left" | "right" | "flat";

/** The hardware drawn around the capture. The iPad turns to match its capture. */
export type DeviceModel = "iphone" | "ipad" | "watch";

interface Props {
  /** Displayed width in CSS pixels. */
  width: number;
  tilt?: DeviceTilt;
  model?: DeviceModel;
  /** The capture's width over its height; the screen takes its shape from it. */
  aspect?: number;
  className?: string;
  /** The capture shown on the screen: an `img` or a `video`. */
  children: ReactNode;
}

/** Slices stacked behind the face to give the body its thickness. */
const EDGE_LAYERS = 16;

/** The buttons along each body's edges, by class in device.css. */
const BUTTONS: Record<DeviceModel, string[]> = {
  iphone: ["action", "volume-up", "volume-down", "side"],
  ipad: ["top", "volume-up", "volume-down"],
  watch: ["crown", "side"],
};

/**
 * An iPhone, iPad or Apple Watch body in CSS 3D that holds a real capture on
 * its screen. It draws only the hardware; the screen content always comes from
 * `npm run media`. Styled in `src/styles/device.css`.
 */
export default function Device({ width, tilt = "left", model = "iphone", aspect, className = "", children }: Props) {
  const style = { width, ...(aspect ? { "--device-screen-aspect": aspect } : {}) } as CSSProperties;

  return (
    <div
      className={`device ${className}`}
      style={style}
      data-tilt={tilt}
      data-model={model}
      data-orientation={aspect && aspect > 1 ? "landscape" : "portrait"}
    >
      <div className="device-body">
        {Array.from({ length: EDGE_LAYERS }, (_, index) => (
          <span key={index} className="device-edge" style={{ "--i": index + 1 } as CSSProperties} aria-hidden="true" />
        ))}
        {BUTTONS[model].map((button) => (
          <span key={button} className={`device-button device-button-${button}`} aria-hidden="true" />
        ))}
        {model === "watch" && (
          <>
            <span className="device-band device-band-top" aria-hidden="true" />
            <span className="device-band device-band-bottom" aria-hidden="true" />
          </>
        )}
        <div className="device-face">
          <div className="device-screen">
            {children}
            {model === "iphone" && <span className="device-island" aria-hidden="true" />}
            <span className="device-glare" aria-hidden="true" />
          </div>
          {model === "ipad" && <span className="device-camera" aria-hidden="true" />}
        </div>
      </div>
    </div>
  );
}
