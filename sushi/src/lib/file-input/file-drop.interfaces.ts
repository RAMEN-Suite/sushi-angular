export interface FileDropContentContext {
  $implicit: readonly File[];
  files: readonly File[];
  active: boolean;
  disabled: boolean;
}

export interface FileDropItemContext {
  $implicit: File;
  file: File;
  index: number;
  size: string;
}

export interface FileDropRejection {
  readonly file: File;
  readonly reason: 'accept';
}
