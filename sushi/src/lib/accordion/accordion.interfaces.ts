/** Stable identifier used to control one accordion item. */
export type AccordionValue = string;

/** Layout treatments available to an accordion group. */
export type AccordionVariant = 'joined' | 'separated';

/** Density and type scales available to an accordion. */
export type AccordionSize = 'sm' | 'md' | 'lg';

/** Public item state exposed to custom templates. */
export interface AccordionItemData {
  readonly value: AccordionValue;
  readonly label: string;
  readonly disabled: boolean;
}

/** Item data and expansion state exposed to accordion templates. */
export interface AccordionItemContext {
  readonly $implicit: AccordionItemData;
  readonly item: AccordionItemData;
  readonly expanded: boolean;
}
