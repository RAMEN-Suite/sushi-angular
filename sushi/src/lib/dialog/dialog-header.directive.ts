import { Directive, input, InputSignal } from '@angular/core';
import { ThemeSeverity } from '../sushi.types';

@Directive({
  selector: 'header[suiDialogHeader]',
  host: {
    class: 'sui-dialog-header',
    '[attr.data-severity]': 'severity()',
  },
})
/** Marks the title and drag region of a structured Dialog. */
export class DialogHeader {
  /** Applies a semantic header color. Omit it to use the neutral header tokens. */
  public readonly severity: InputSignal<ThemeSeverity | null> = input<ThemeSeverity | null>(null);
}
