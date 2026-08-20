import type { Signal } from '@angular/core';

/** Context exposed to the complete code copy-button template. */
export interface CodeButtonContext {
  $implicit: () => void;
  copy: () => void;
  copied: Signal<boolean>;
}
