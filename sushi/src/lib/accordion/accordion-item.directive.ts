import {
  booleanAttribute,
  Directive,
  inject,
  input,
  type InputSignal,
  type InputSignalWithTransform,
  TemplateRef,
} from '@angular/core';
import { type AccordionItemContext, type AccordionValue } from './accordion.interfaces';

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
  public readonly disabled: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });
  /** Keeps the content instantiated after its first expansion. */
  public readonly preserveContent: InputSignalWithTransform<boolean, unknown> = input(true, { transform: booleanAttribute });

  public readonly template: TemplateRef<AccordionItemContext> = inject<TemplateRef<AccordionItemContext>>(TemplateRef);
}
