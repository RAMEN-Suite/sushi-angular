import { SelectionValue } from '../sushi.types';

/** One selectable label and value with optional disabled state. */
export interface SelectionOption {
  readonly label: string;
  readonly value: SelectionValue;
  readonly disabled?: boolean;
}

/** Shared context exposed by replaceable filters on selection collections. */
export interface SelectionFilterContext {
  readonly $implicit: string;
  readonly query: string;
  readonly placeholder: string;
  readonly disabled: boolean;
  readonly readOnly: boolean;
  readonly update: (query: string) => void;
}

/** Compares two selection values for identity. */
export type SelectionCompareWith = (first: SelectionValue, second: SelectionValue) => boolean;
/** Determines whether an option matches a text query. */
export type SelectionFilter = (option: SelectionOption, query: string) => boolean;
