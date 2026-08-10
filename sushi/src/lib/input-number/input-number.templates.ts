import { Directive } from '@angular/core';
import { InputNumberButtonsContext } from './input-number.interfaces';

/** Replaces the complete increment and decrement control group. */
@Directive({ selector: 'ng-template[suiInputNumberButtons]' })
export class InputNumberButtonsTemplate {
  public static ngTemplateContextGuard(
    _directive: InputNumberButtonsTemplate,
    _context: unknown,
  ): _context is InputNumberButtonsContext {
    return true;
  }
}
