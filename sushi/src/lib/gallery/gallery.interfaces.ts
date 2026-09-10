/** One image shared by Gallery and Lightbox. */
export interface GalleryImage<T = string> {
  /** Stable consumer value associated with the image. */
  readonly value: T;
  /** Full-size image source URL. */
  readonly src: string;
  /** Intrinsic full-size image width in pixels. */
  readonly width: number;
  /** Intrinsic full-size image height in pixels. */
  readonly height: number;
  /** Alternative text describing the image. */
  readonly alt: string;
  /** Optional caption displayed with the image. */
  readonly caption?: string;
  /** Optional smaller source used by Gallery thumbnails and Lightbox transitions. */
  readonly thumbnailSrc?: string;
  /** Optional responsive source candidates used by the Lightbox. */
  readonly srcset?: string;
}
