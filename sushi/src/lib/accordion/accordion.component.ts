import { NgTemplateOutlet } from '@angular/common';
import {
  AccordionContent as AriaAccordionContent,
  AccordionGroup as AriaAccordionGroup,
  AccordionPanel as AriaAccordionPanel,
  AccordionTrigger as AriaAccordionTrigger,
} from '@angular/aria/accordion';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  contentChild,
  contentChildren,
  input,
  InputSignal,
  InputSignalWithTransform,
  model,
  ModelSignal,
  Signal,
  TemplateRef,
} from '@angular/core';
import { LucideChevronDown } from '@lucide/angular';
import { AccordionItem } from './accordion-item.directive';
import { AccordionItemContext, AccordionItemData, AccordionSize, AccordionValue, AccordionVariant } from './accordion.interfaces';
import { AccordionHeaderTemplate, AccordionIndicatorTemplate } from './accordion.templates';

/** Organizes related content into accessible expandable sections. */
@Component({
  selector: 'sui-accordion',
  imports: [
    AriaAccordionContent,
    AriaAccordionGroup,
    AriaAccordionPanel,
    AriaAccordionTrigger,
    LucideChevronDown,
    NgTemplateOutlet,
  ],
  templateUrl: './accordion.component.html',
  styleUrl: './accordion.component.css',
  host: { class: 'sui-accordion block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Accordion {
  /** Expanded item values. Single mode keeps at most one value. */
  public readonly value: ModelSignal<readonly AccordionValue[]> = model<readonly AccordionValue[]>([]);

  /** Allows more than one item to remain expanded. */
  public readonly multiple: InputSignalWithTransform<boolean, unknown> = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  /** Changes whether item borders are connected or separated. */
  public readonly variant: InputSignal<AccordionVariant> = input<AccordionVariant>('joined');
  /** Controls header type, spacing, and content density. */
  public readonly size: InputSignal<AccordionSize> = input<AccordionSize>('sm');
  /** Disables every accordion trigger. */
  public readonly disabled: InputSignalWithTransform<boolean, unknown> = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  /** Allows disabled items to receive focus while remaining inactive. */
  public readonly softDisabled: InputSignalWithTransform<boolean, unknown> = input<boolean, unknown>(true, {
    transform: booleanAttribute,
  });
  /** Wraps arrow-key navigation between the first and last trigger. */
  public readonly wrap: InputSignalWithTransform<boolean, unknown> = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });

  protected readonly items: Signal<readonly AccordionItem[]> = contentChildren(AccordionItem);
  protected readonly headerTemplate: Signal<TemplateRef<AccordionItemContext> | undefined> = contentChild(
    AccordionHeaderTemplate,
    { read: TemplateRef },
  );
  protected readonly indicatorTemplate: Signal<TemplateRef<AccordionItemContext> | undefined> = contentChild(
    AccordionIndicatorTemplate,
    { read: TemplateRef },
  );

  /** Expands every enabled item when multiple expansion is enabled. */
  public expandAll(): void {
    if (!this.multiple() || this.disabled()) return;
    this.value.set(
      this.items()
        .filter((item: AccordionItem): boolean => !item.disabled())
        .map((item: AccordionItem): AccordionValue => item.value()),
    );
  }

  /** Collapses every accordion item. */
  public collapseAll(): void {
    this.value.set([]);
  }

  protected handleExpanded(value: AccordionValue, expanded: boolean): void {
    if (expanded) {
      this.value.set(this.multiple() ? [...new Set([...this.value(), value])] : [value]);
      return;
    }

    this.value.set(this.value().filter((item: AccordionValue): boolean => item !== value));
  }

  protected itemContext(item: AccordionItem): AccordionItemContext {
    const data: AccordionItemData = {
      value: item.value(),
      label: item.label(),
      disabled: item.disabled(),
    };
    return { $implicit: data, item: data, expanded: this.value().includes(data.value) };
  }
}
