import { SelectionFilterContext, SelectionOption } from '../selection';
import { SelectionValue } from '../sushi.types';

/** Value accepted by a listbox option. */
export type ListboxValue = SelectionValue;
/** Selected value for single selection or values for multiple selection. */
export type ListboxModelValue = ListboxValue | readonly ListboxValue[] | null;
/** Selectable item rendered by a listbox. */
export interface ListboxOption extends SelectionOption {
  /** Optional group name used to arrange related options. */
  readonly group?: string;
}
/** Context exposed when replacing the listbox filter. */
export type ListboxFilterContext = SelectionFilterContext;
/** Context exposed to the listbox item template. */
export interface ListboxItemContext<O extends ListboxOption = ListboxOption> {
  /** Current option, available as the implicit template value. */
  readonly $implicit: O;
  /** Current option. */
  readonly option: O;
  /** Zero-based position in the visible options. */
  readonly index: number;
  /** Whether the option is selected. */
  readonly selected: boolean;
  /** Whether the option is the current keyboard target. */
  readonly active: boolean;
  /** Whether the option cannot be selected. */
  readonly disabled: boolean;
}

/** Context exposed to a listbox group template. */
export interface ListboxGroupContext {
  /** Group name, available as the implicit template value. */
  readonly $implicit: string;
  /** Name of the rendered option group. */
  readonly group: string;
}
