import { Directive } from '@angular/core';
import { SelectButtonOptionContext } from './select-button.interfaces';

/** Replaces every option label and exposes option, index, selected, and disabled state. */
@Directive({
  selector: 'ng-template[suiSelectButtonOption]',
})
export class SelectButtonOptionTemplate {
  public static ngTemplateContextGuard(
    _directive: SelectButtonOptionTemplate,
    _context: unknown,
  ): _context is SelectButtonOptionContext {
    return true;
  }
}
