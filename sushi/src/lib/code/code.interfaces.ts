import { WritableSignal } from '@angular/core';

export interface SuiCodeCopyButtonContext {
  $implicit: () => void;
  copy: () => void;
  isCopied: WritableSignal<boolean>;
}
