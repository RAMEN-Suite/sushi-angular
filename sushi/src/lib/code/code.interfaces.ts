import { WritableSignal } from '@angular/core';

export interface CodeButtonContext {
  $implicit: () => void;
  copy: () => void;
  copied: WritableSignal<boolean>;
}
