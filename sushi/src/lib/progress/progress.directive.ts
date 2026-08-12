import { Directive, input, InputSignal } from '@angular/core';
import { ProgressSeverity } from './progress.interfaces';

/** Styles a native progress element without replacing its value, maximum, or accessibility semantics. */
@Directive({
  selector: 'progress[suiProgress]',
  host: {
    class: 'progress sui-progress',
    '[class.progress-primary]': 'severity() === "primary"',
    '[class.progress-secondary]': 'severity() === "secondary"',
    '[class.progress-neutral]': 'severity() === "neutral"',
    '[class.progress-accent]': 'severity() === "accent"',
    '[class.progress-info]': 'severity() === "info"',
    '[class.progress-success]': 'severity() === "success"',
    '[class.progress-warning]': 'severity() === "warning"',
    '[class.progress-error]': 'severity() === "error"',
  },
})
export class Progress {
  /** Applies one semantic theme color while preserving the native progress behavior. */
  public readonly severity: InputSignal<ProgressSeverity | null> = input<ProgressSeverity | null>(null);
}
