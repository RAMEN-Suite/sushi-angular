import { WritableSignal } from '@angular/core';

export interface SuiCodeButtonContext {
  $implicit: () => void;
  copy: () => void;
  copied: WritableSignal<boolean>;
}
