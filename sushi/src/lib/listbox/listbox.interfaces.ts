import { SelectionFilterContext, SelectionOption } from '../selection';
import { SelectionValue } from '../sushi.types';

/** Value accepted by a listbox option. */
export type ListboxValue = SelectionValue;
/** Selected value for single selection or values for multiple selection. */
export type ListboxModelValue = ListboxValue | readonly ListboxValue[] | null;
/** Selectable item rendered by a listbox. */
export interface ListboxOption extends SelectionOption {
  readonly group?: string;
}
/** Context exposed when replacing the listbox filter. */
export type ListboxFilterContext = SelectionFilterContext;
/** Context exposed to the listbox item template. */
export interface ListboxItemContext {
  readonly $implicit: ListboxOption;
  readonly option: ListboxOption;
  readonly index: number;
  readonly selected: boolean;
  readonly active: boolean;
  readonly disabled: boolean;
}

/** Context exposed to a listbox group template. */
export interface ListboxGroupContext {
  readonly $implicit: string;
  readonly group: string;
}
