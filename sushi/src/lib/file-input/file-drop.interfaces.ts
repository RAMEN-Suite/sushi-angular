/** Context exposed to the file-drop instruction template. */
export interface FileDropContentContext {
  $implicit: readonly File[];
  files: readonly File[];
  active: boolean;
  disabled: boolean;
}

/** Context exposed to each selected file template. */
export interface FileDropItemContext {
  $implicit: File;
  file: File;
  index: number;
  size: string;
}

/** File rejected by the drop zone and its rejection reason. */
export interface FileDropRejection {
  readonly file: File;
  readonly reason: 'accept';
}
