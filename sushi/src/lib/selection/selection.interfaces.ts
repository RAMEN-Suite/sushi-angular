import { SelectionValue } from '../sushi.types';

export interface SelectionOption {
  readonly label: string;
  readonly value: SelectionValue;
  readonly disabled?: boolean;
}

export type SelectionCompareWith = (first: SelectionValue, second: SelectionValue) => boolean;
export type SelectionFilter = (option: SelectionOption, query: string) => boolean;
