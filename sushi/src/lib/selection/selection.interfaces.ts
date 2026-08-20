import { SelectionValue } from '../sushi.types';

/** One selectable label and value with optional disabled state. */
export interface SelectionOption {
  readonly label: string;
  readonly value: SelectionValue;
  readonly disabled?: boolean;
}

/** Compares two selection values for identity. */
export type SelectionCompareWith = (first: SelectionValue, second: SelectionValue) => boolean;
/** Determines whether an option matches a text query. */
export type SelectionFilter = (option: SelectionOption, query: string) => boolean;
