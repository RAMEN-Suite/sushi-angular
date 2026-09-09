import type { Signal } from '@angular/core';

/** Context exposed to the complete code copy-button template. */
export interface CodeButtonContext {
  /** Runs the copy action, available as the implicit template value. */
  $implicit: () => void;
  /** Runs the copy action. */
  copy: () => void;
  /** Reactive success state of the latest copy attempt. */
  copied: Signal<boolean>;
}
