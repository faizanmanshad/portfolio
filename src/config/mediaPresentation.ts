export interface MediaPresentation {
  /** The max width of the outer container in pixels. e.g., 320 */
  frameWidth: number;
  /** The max height of the outer container in pixels. e.g., 420 */
  frameHeight: number;
  /** Image rotation in degrees (e.g., 90, -90, 180). Positive is clockwise. */
  rotation: number;
  /** Image scale multiplier (1 = 100%, 1.5 = 150%). Used for zooming in/out. */
  scale: number;
  /** How the image should fit in the frame. Usually "contain" or "cover". */
  objectFit: "contain" | "cover" | "fill" | "none" | "scale-down";
  /** Alignment of the image within the frame. e.g., "50% 50%", "top center". */
  objectPosition: string;
  /** Percentage of the image to crop from the top edge (0 to 100). */
  cropTop: number;
  /** Percentage of the image to crop from the right edge (0 to 100). */
  cropRight: number;
  /** Percentage of the image to crop from the bottom edge (0 to 100). */
  cropBottom: number;
  /** Percentage of the image to crop from the left edge (0 to 100). */
  cropLeft: number;
}

export const defaultPresentation: MediaPresentation = {
  frameWidth: 320,
  frameHeight: 420,
  rotation: 0,
  scale: 1,
  objectFit: "contain",
  objectPosition: "50% 50%",
  cropTop: 0,
  cropRight: 0,
  cropBottom: 0,
  cropLeft: 0,
};

/**
 * Configure presentation settings for individual R2 images.
 * You only need to provide the fields you want to override from the defaults.
 */
export const mediaPresentationConfig: Record<string, Partial<MediaPresentation>> = {
  "01-honors-awards/display/2nd-position-truss-bridge-competition.webp": {
    frameWidth: 320,
    frameHeight: 420,
    rotation: 90,
    scale: 1,
    objectFit: "contain",
    objectPosition: "50% 50%",
    cropTop: 0,
    cropRight: 0,
    cropBottom: 0,
    cropLeft: 0,
  },
};

export function getMediaPresentation(path: string): MediaPresentation {
  const custom = mediaPresentationConfig[path];
  return { ...defaultPresentation, ...custom };
}
