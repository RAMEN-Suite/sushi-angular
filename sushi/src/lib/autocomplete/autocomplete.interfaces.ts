import { SelectionCompareWith, SelectionFilter, SelectionOption } from '../selection';
import { SelectionValue } from '../sushi.types';

/** Value held by an autocomplete control. */
export type AutocompleteValue = SelectionValue | null;
/** One suggestion available to an autocomplete control. */
export type AutocompleteOption = SelectionOption;
/** Compares autocomplete values for identity. */
export type AutocompleteCompareWith = SelectionCompareWith;
/** Filters autocomplete suggestions for a query. */
export type AutocompleteFilter = SelectionFilter;

/** Context exposed to an autocomplete item template. */
export interface AutocompleteItemContext {
  readonly $implicit: AutocompleteOption;
  readonly option: AutocompleteOption;
  readonly selected: boolean;
  readonly matched: boolean;
  readonly disabled: boolean;
  readonly index: number;
}

/** Context exposed to autocomplete status templates. */
export interface AutocompleteStatusContext {
  readonly $implicit: string;
  readonly message: string;
  readonly query: string;
}
