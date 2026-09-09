import {
  SelectCompareWith,
  SelectGroupContext,
  SelectItemContext,
  SelectLoadingContext,
  SelectOption,
  SelectValue,
  SelectVariant,
} from '../select';

/** Value accepted by a multi-select option. */
export type MultiSelectValue = SelectValue;
/** Array held by a multi-select model. */
export type MultiSelectModelValue = MultiSelectValue[];
/** One option available to a multi-select. */
export type MultiSelectOption = SelectOption;
/** Compares multi-select values for identity. */
export type MultiSelectCompareWith = SelectCompareWith;
/** Additional visual treatment available to a multi-select. */
export type MultiSelectVariant = SelectVariant;
/** Context exposed to a multi-select option template. */
export type MultiSelectItemContext<O extends MultiSelectOption = MultiSelectOption> = SelectItemContext<O>;
/** Context exposed to a multi-select group-heading template. */
export type MultiSelectGroupContext<O extends MultiSelectOption = MultiSelectOption> = SelectGroupContext<O>;
/** Context exposed to the multi-select loading template. */
export type MultiSelectLoadingContext = SelectLoadingContext;

/** Context exposed to the selected-values summary template. */
export interface MultiSelectSelectedItemsContext<O extends MultiSelectOption = MultiSelectOption> {
  readonly $implicit: readonly O[];
  readonly options: readonly O[];
  readonly remove: (option: O) => void;
  readonly disabled: boolean;
}

/** Context exposed to a multi-select header template. */
export interface MultiSelectHeaderContext<O extends MultiSelectOption = MultiSelectOption> {
  readonly $implicit: readonly O[];
  readonly options: readonly O[];
  readonly selectedCount: number;
  readonly allSelected: boolean;
  readonly disabled: boolean;
  readonly toggleAll: () => void;
}
