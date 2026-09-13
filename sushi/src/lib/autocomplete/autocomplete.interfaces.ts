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
export interface AutocompleteItemContext<O extends AutocompleteOption = AutocompleteOption> {
  /** Current suggestion, available as the implicit template value. */
  readonly $implicit: O;
  /** Current suggestion. */
  readonly option: O;
  /** Whether the suggestion matches the control value. */
  readonly selected: boolean;
  /** Whether the suggestion matches the current query. */
  readonly matched: boolean;
  /** Whether the suggestion cannot be selected. */
  readonly disabled: boolean;
  /** Zero-based position in the filtered suggestions. */
  readonly index: number;
}

/** Context exposed to autocomplete status templates. */
export interface AutocompleteStatusContext {
  /** Status message, available as the implicit template value. */
  readonly $implicit: string;
  /** Status message shown by the autocomplete. */
  readonly message: string;
  /** Current search query. */
  readonly query: string;
}
