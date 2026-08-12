import { Directive } from '@angular/core';
import { ChipContentContext } from './chip.interfaces';

/** Replaces the projected content and label of a chip. */
@Directive({ selector: 'ng-template[suiChipContent]' })
export class ChipContentTemplate {
  public static ngTemplateContextGuard(_directive: ChipContentTemplate, _context: unknown): _context is ChipContentContext {
    return true;
  }
}

/** Replaces the remove icon of a removable chip. */
@Directive({ selector: 'ng-template[suiChipRemoveIcon]' })
export class ChipRemoveIconTemplate {}
