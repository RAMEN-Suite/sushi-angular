/** Stable identifier used to control one accordion item. */
export type AccordionValue = string;

/** Layout treatments available to an accordion group. */
export type AccordionVariant = 'joined' | 'separated';

/** Density and type scales available to an accordion. */
export type AccordionSize = 'sm' | 'md' | 'lg';

/** Public item state exposed to custom templates. */
export interface AccordionItemData {
  /** Stable value used by the parent expansion model. */
  readonly value: AccordionValue;
  /** Visible default heading. */
  readonly label: string;
  /** Whether the item cannot be toggled. */
  readonly disabled: boolean;
}

/** Item data and expansion state exposed to accordion templates. */
export interface AccordionItemContext {
  /** Current item, available as the implicit template value. */
  readonly $implicit: AccordionItemData;
  /** Current item. */
  readonly item: AccordionItemData;
  /** Whether the current item is expanded. */
  readonly expanded: boolean;
}
