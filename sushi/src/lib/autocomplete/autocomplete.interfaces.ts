import { SelectionCompareWith, SelectionFilter, SelectionOption } from '../selection';
import { SelectionValue } from '../sushi.types';

export type AutocompleteValue = SelectionValue | null;
export type AutocompleteOption = SelectionOption;
export type AutocompleteCompareWith = SelectionCompareWith;
export type AutocompleteFilter = SelectionFilter;

export interface AutocompleteItemContext {
  readonly $implicit: AutocompleteOption;
  readonly option: AutocompleteOption;
  readonly selected: boolean;
  readonly disabled: boolean;
  readonly index: number;
}

export interface AutocompleteStatusContext {
  readonly $implicit: string;
  readonly message: string;
  readonly query: string;
}
