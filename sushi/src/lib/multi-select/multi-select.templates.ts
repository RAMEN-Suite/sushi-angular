import { Directive } from '@angular/core';
import {
  MultiSelectGroupContext,
  MultiSelectHeaderContext,
  MultiSelectItemContext,
  MultiSelectLoadingContext,
  MultiSelectSelectedItemsContext,
} from './multi-select.interfaces';

/** Replaces each option and exposes its index, selected, and disabled state. */
@Directive({ selector: 'ng-template[suiMultiSelectItem]' })
export class MultiSelectItemTemplate {
  public static ngTemplateContextGuard(
    _directive: MultiSelectItemTemplate,
    _context: unknown,
  ): _context is MultiSelectItemContext {
    return true;
  }
}

/** Replaces the selected-value summary and exposes removal behavior. */
@Directive({ selector: 'ng-template[suiMultiSelectSelectedItems]' })
export class MultiSelectSelectedItemsTemplate {
  public static ngTemplateContextGuard(
    _directive: MultiSelectSelectedItemsTemplate,
    _context: unknown,
  ): _context is MultiSelectSelectedItemsContext {
    return true;
  }
}

/** Replaces each group heading and exposes its group and first option. */
@Directive({ selector: 'ng-template[suiMultiSelectGroup]' })
export class MultiSelectGroupTemplate {
  public static ngTemplateContextGuard(
    _directive: MultiSelectGroupTemplate,
    _context: unknown,
  ): _context is MultiSelectGroupContext {
    return true;
  }
}

/** Replaces the loading message and exposes its text. */
@Directive({ selector: 'ng-template[suiMultiSelectLoading]' })
export class MultiSelectLoadingTemplate {
  public static ngTemplateContextGuard(
    _directive: MultiSelectLoadingTemplate,
    _context: unknown,
  ): _context is MultiSelectLoadingContext {
    return true;
  }
}

/** Replaces the loading icon shown in the closed control. */
@Directive({ selector: 'ng-template[suiMultiSelectLoadingIcon]' })
export class MultiSelectLoadingIconTemplate {}

/** Replaces the popup indicator icon. */
@Directive({ selector: 'ng-template[suiMultiSelectDropdownIcon]' })
export class MultiSelectDropdownIconTemplate {}

/** Replaces the clear icon. */
@Directive({ selector: 'ng-template[suiMultiSelectClearIcon]' })
export class MultiSelectClearIconTemplate {}

/** Replaces the selected-option checkmark. */
@Directive({ selector: 'ng-template[suiMultiSelectCheckmarkIcon]' })
export class MultiSelectCheckmarkIconTemplate {}

/** Adds content above the list and exposes aggregate selection behavior. */
@Directive({ selector: 'ng-template[suiMultiSelectHeader]' })
export class MultiSelectHeaderTemplate {
  public static ngTemplateContextGuard(
    _directive: MultiSelectHeaderTemplate,
    _context: unknown,
  ): _context is MultiSelectHeaderContext {
    return true;
  }
}

/** Adds content below the option list. */
@Directive({ selector: 'ng-template[suiMultiSelectFooter]' })
export class MultiSelectFooterTemplate {}

/** Replaces the empty-options message. */
@Directive({ selector: 'ng-template[suiMultiSelectEmpty]' })
export class MultiSelectEmptyTemplate {}
