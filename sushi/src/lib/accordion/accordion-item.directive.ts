import { booleanAttribute, Directive, inject, input, InputSignal, InputSignalWithTransform, TemplateRef } from '@angular/core';
import { AccordionItemContext, AccordionValue } from './accordion.interfaces';

/** Defines one accordion heading, value, and content template. */
@Directive({ selector: 'ng-template[suiAccordionItem]' })
export class AccordionItem {
  public static ngTemplateContextGuard(_directive: AccordionItem, _context: unknown): _context is AccordionItemContext {
    return true;
  }

  /** Identifies the item in the parent value model. */
  public readonly value: InputSignal<AccordionValue> = input.required<AccordionValue>();
  /** Sets the visible heading text. */
  public readonly label: InputSignal<string> = input.required<string>();
  /** Prevents the item from being toggled. */
  public readonly disabled: InputSignalWithTransform<boolean, unknown> = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  /** Keeps the content instantiated after its first expansion. */
  public readonly preserveContent: InputSignalWithTransform<boolean, unknown> = input<boolean, unknown>(true, {
    transform: booleanAttribute,
  });

  public readonly template: TemplateRef<AccordionItemContext> = inject<TemplateRef<AccordionItemContext>>(TemplateRef);
}
