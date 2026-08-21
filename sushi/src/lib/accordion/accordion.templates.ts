import { Directive } from '@angular/core';
import { AccordionItemContext } from './accordion.interfaces';

/** Replaces each accordion heading and exposes its item and expanded state. */
@Directive({ selector: 'ng-template[suiAccordionHeader]' })
export class AccordionHeaderTemplate {
  public static ngTemplateContextGuard(_directive: AccordionHeaderTemplate, _context: unknown): _context is AccordionItemContext {
    return true;
  }
}

/** Replaces each accordion indicator and exposes its item and expanded state. */
@Directive({ selector: 'ng-template[suiAccordionIndicator]' })
export class AccordionIndicatorTemplate {
  public static ngTemplateContextGuard(
    _directive: AccordionIndicatorTemplate,
    _context: unknown,
  ): _context is AccordionItemContext {
    return true;
  }
}
