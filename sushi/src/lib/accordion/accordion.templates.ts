import { Directive } from '@angular/core';
import { type AccordionItemContext } from './accordion.interfaces';

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

/** Adds independent actions beside each trigger, outside its button and heading. Uses normal Tab order; Enter/Space activate the action and header-navigation keys do not affect the Accordion. Consumers control action labels and disabled state. */
@Directive({ selector: 'ng-template[suiAccordionActions]' })
export class AccordionActionsTemplate {
  public static ngTemplateContextGuard(
    _directive: AccordionActionsTemplate,
    _context: unknown,
  ): _context is AccordionItemContext {
    return true;
  }
}
