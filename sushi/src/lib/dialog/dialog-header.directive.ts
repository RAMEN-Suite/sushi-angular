import { Directive, input, type InputSignal } from '@angular/core';
import { type ThemeSeverity } from '../sushi.types';

/** Marks the title and drag region of a structured Dialog. */
@Directive({
  selector: 'header[suiDialogHeader]',
  host: {
    class: 'sui-dialog-header',
    '[attr.data-severity]': 'severity()',
  },
})
export class DialogHeader {
  /** Applies a semantic header color. Omit it to use the neutral header tokens. */
  public readonly severity: InputSignal<ThemeSeverity | null> = input<ThemeSeverity | null>(null);
}
