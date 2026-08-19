import type { Signal } from '@angular/core';

export interface CodeButtonContext {
  $implicit: () => void;
  copy: () => void;
  copied: Signal<boolean>;
}
