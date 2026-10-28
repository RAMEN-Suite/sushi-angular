import { Directive, input, type InputSignal } from '@angular/core';
import {
  type SelectGroupContext,
  type SelectItemContext,
  type SelectOption,
  type SelectLoadingContext,
  type SelectSelectedItemContext,
} from './select.interfaces';

/** Replaces each option and exposes its index, selected, and disabled state. */
@Directive({ selector: 'ng-template[suiSelectItem]' })
export class SelectItemTemplate<O extends SelectOption = SelectOption> {
  /** Option source used to infer custom fields inside the template. */
  public readonly options: InputSignal<readonly O[] | '' | undefined> = input<readonly O[] | '' | undefined>(undefined, {
    alias: 'suiSelectItem',
  });
  public static ngTemplateContextGuard<O extends SelectOption>(
    _directive: SelectItemTemplate<O>,
    _context: unknown,
  ): _context is SelectItemContext<O> {
    return true;
  }
}

/** Replaces the selected value shown in the closed control. */
@Directive({ selector: 'ng-template[suiSelectSelectedItem]' })
export class SelectSelectedItemTemplate<O extends SelectOption = SelectOption> {
  /** Option source used to infer custom fields inside the template. */
  public readonly options: InputSignal<readonly O[] | '' | undefined> = input<readonly O[] | '' | undefined>(undefined, {
    alias: 'suiSelectSelectedItem',
  });
  public static ngTemplateContextGuard<O extends SelectOption>(
    _directive: SelectSelectedItemTemplate<O>,
    _context: unknown,
  ): _context is SelectSelectedItemContext<O> {
    return true;
  }
}

/** Replaces each group heading and exposes its group and first option. */
@Directive({ selector: 'ng-template[suiSelectGroup]' })
export class SelectGroupTemplate<O extends SelectOption = SelectOption> {
  /** Option source used to infer custom fields inside the template. */
  public readonly options: InputSignal<readonly O[] | '' | undefined> = input<readonly O[] | '' | undefined>(undefined, {
    alias: 'suiSelectGroup',
  });
  public static ngTemplateContextGuard<O extends SelectOption>(
    _directive: SelectGroupTemplate<O>,
    _context: unknown,
  ): _context is SelectGroupContext<O> {
    return true;
  }
}

/** Replaces the loading message and exposes its text. */
@Directive({ selector: 'ng-template[suiSelectLoading]' })
export class SelectLoadingTemplate {
  public static ngTemplateContextGuard(_directive: SelectLoadingTemplate, _context: unknown): _context is SelectLoadingContext {
    return true;
  }
}

/** Replaces the loading icon shown in the closed control. */
@Directive({ selector: 'ng-template[suiSelectLoadingIcon]' })
export class SelectLoadingIconTemplate {}

/** Replaces the popup indicator icon. */
@Directive({ selector: 'ng-template[suiSelectDropdownIcon]' })
export class SelectDropdownIconTemplate {}

/** Replaces the clear icon. */
@Directive({ selector: 'ng-template[suiSelectClearIcon]' })
export class SelectClearIconTemplate {}

/** Replaces the selected-option checkmark. */
@Directive({ selector: 'ng-template[suiSelectCheckmarkIcon]' })
export class SelectCheckmarkIconTemplate {}

/** Adds focusable or static content above the option list. Interactive popup content supports Tab; Escape closes and restores control focus. */
@Directive({ selector: 'ng-template[suiSelectHeader]' })
export class SelectHeaderTemplate {}

/** Adds focusable or static content below the option list. Escape closes the popup and restores control focus. */
@Directive({ selector: 'ng-template[suiSelectFooter]' })
export class SelectFooterTemplate {}

/** Replaces the empty-options message. */
@Directive({ selector: 'ng-template[suiSelectEmpty]' })
export class SelectEmptyTemplate {}
