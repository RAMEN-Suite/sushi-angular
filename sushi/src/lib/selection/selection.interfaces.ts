import { SelectionValue } from '../sushi.types';

/** One selectable label and value with optional disabled state. */
export interface SelectionOption {
  /** Visible option label. */
  readonly label: string;
  /** Value written to the selection control. */
  readonly value: SelectionValue;
  /** Prevents the option from being selected. */
  readonly disabled?: boolean;
}

/** Shared context exposed by replaceable filters on selection collections. */
export interface SelectionFilterContext {
  /** Current query, available as the implicit template value. */
  readonly $implicit: string;
  /** Current filter query. */
  readonly query: string;
  /** Placeholder shown by the default filter control. */
  readonly placeholder: string;
  /** Whether filtering and selection are disabled. */
  readonly disabled: boolean;
  /** Whether the query can be changed. */
  readonly readOnly: boolean;
  /** Replaces the current filter query. */
  readonly update: (query: string) => void;
}

/** Compares two selection values for identity. */
export type SelectionCompareWith = (first: SelectionValue, second: SelectionValue) => boolean;
/** Determines whether an option matches a text query. */
export type SelectionFilter = (option: SelectionOption, query: string) => boolean;
