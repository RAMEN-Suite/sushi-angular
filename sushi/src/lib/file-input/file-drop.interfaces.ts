/** Context exposed to the file-drop instruction template. */
export interface FileDropContentContext {
  /** Selected files, available as the implicit template value. */
  $implicit: readonly File[];
  /** Files currently held by the drop zone. */
  files: readonly File[];
  /** Whether a supported drag operation is over the drop zone. */
  active: boolean;
  /** Whether file selection and dropping are disabled. */
  disabled: boolean;
}

/** Context exposed to each selected file template. */
export interface FileDropItemContext {
  /** Current file, available as the implicit template value. */
  $implicit: File;
  /** Current selected file. */
  file: File;
  /** Zero-based position in the selected files. */
  index: number;
  /** Human-readable file size. */
  size: string;
}

/** File rejected by the drop zone and its rejection reason. */
export interface FileDropRejection {
  /** File that was not accepted. */
  readonly file: File;
  /** Reason the file was rejected. */
  readonly reason: 'accept';
}
