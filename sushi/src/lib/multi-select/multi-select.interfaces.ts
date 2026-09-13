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
  /** Selected options, available as the implicit template value. */
  readonly $implicit: readonly O[];
  /** Currently selected options. */
  readonly options: readonly O[];
  /** Removes an option from the current selection. */
  readonly remove: (option: O) => void;
  /** Whether selection changes are disabled. */
  readonly disabled: boolean;
}

/** Context exposed to a multi-select header template. */
export interface MultiSelectHeaderContext<O extends MultiSelectOption = MultiSelectOption> {
  /** Available options, exposed as the implicit template value. */
  readonly $implicit: readonly O[];
  /** Options currently available for selection. */
  readonly options: readonly O[];
  /** Number of currently selected options. */
  readonly selectedCount: number;
  /** Whether every selectable option is selected. */
  readonly allSelected: boolean;
  /** Whether selection changes are disabled. */
  readonly disabled: boolean;
  /** Selects all options or clears the complete selection. */
  readonly toggleAll: () => void;
}
