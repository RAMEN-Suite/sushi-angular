import { Directive } from '@angular/core';
import { SelectGroupContext, SelectItemContext, SelectLoadingContext, SelectSelectedItemContext } from './select.interfaces';

/** Replaces each option and exposes its index, selected, and disabled state. */
@Directive({ selector: 'ng-template[suiSelectItem]' })
export class SelectItemTemplate {
  public static ngTemplateContextGuard(_directive: SelectItemTemplate, _context: unknown): _context is SelectItemContext {
    return true;
  }
}

/** Replaces the selected value shown in the closed control. */
@Directive({ selector: 'ng-template[suiSelectSelectedItem]' })
export class SelectSelectedItemTemplate {
  public static ngTemplateContextGuard(
    _directive: SelectSelectedItemTemplate,
    _context: unknown,
  ): _context is SelectSelectedItemContext {
    return true;
  }
}

/** Replaces each group heading and exposes its group and first option. */
@Directive({ selector: 'ng-template[suiSelectGroup]' })
export class SelectGroupTemplate {
  public static ngTemplateContextGuard(_directive: SelectGroupTemplate, _context: unknown): _context is SelectGroupContext {
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

/** Adds content above the option list. */
@Directive({ selector: 'ng-template[suiSelectHeader]' })
export class SelectHeaderTemplate {}

/** Adds content below the option list. */
@Directive({ selector: 'ng-template[suiSelectFooter]' })
export class SelectFooterTemplate {}

/** Replaces the empty-options message. */
@Directive({ selector: 'ng-template[suiSelectEmpty]' })
export class SelectEmptyTemplate {}
