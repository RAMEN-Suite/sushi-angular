import {
  SelectCompareWith,
  SelectGroupContext,
  SelectItemContext,
  SelectLoadingContext,
  SelectOption,
  SelectValue,
  SelectVariant,
} from '../select';

export type MultiSelectValue = SelectValue;
export type MultiSelectModelValue = MultiSelectValue[];
export type MultiSelectOption = SelectOption;
export type MultiSelectCompareWith = SelectCompareWith;
export type MultiSelectVariant = SelectVariant;
export type MultiSelectItemContext = SelectItemContext;
export type MultiSelectGroupContext = SelectGroupContext;
export type MultiSelectLoadingContext = SelectLoadingContext;

export interface MultiSelectSelectedItemsContext {
  readonly $implicit: readonly MultiSelectOption[];
  readonly options: readonly MultiSelectOption[];
  readonly remove: (option: MultiSelectOption) => void;
  readonly disabled: boolean;
}

export interface MultiSelectHeaderContext {
  readonly $implicit: readonly MultiSelectOption[];
  readonly options: readonly MultiSelectOption[];
  readonly selectedCount: number;
  readonly allSelected: boolean;
  readonly disabled: boolean;
  readonly toggleAll: () => void;
}
