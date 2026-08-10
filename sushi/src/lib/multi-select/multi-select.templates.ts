import { Directive } from '@angular/core';
import {
  MultiSelectGroupContext,
  MultiSelectHeaderContext,
  MultiSelectItemContext,
  MultiSelectLoadingContext,
  MultiSelectSelectedItemsContext,
} from './multi-select.interfaces';

@Directive({ selector: 'ng-template[suiMultiSelectItem]' })
export class MultiSelectItemTemplate {
  public static ngTemplateContextGuard(
    _directive: MultiSelectItemTemplate,
    _context: unknown,
  ): _context is MultiSelectItemContext {
    return true;
  }
}

@Directive({ selector: 'ng-template[suiMultiSelectSelectedItems]' })
export class MultiSelectSelectedItemsTemplate {
  public static ngTemplateContextGuard(
    _directive: MultiSelectSelectedItemsTemplate,
    _context: unknown,
  ): _context is MultiSelectSelectedItemsContext {
    return true;
  }
}

@Directive({ selector: 'ng-template[suiMultiSelectGroup]' })
export class MultiSelectGroupTemplate {
  public static ngTemplateContextGuard(
    _directive: MultiSelectGroupTemplate,
    _context: unknown,
  ): _context is MultiSelectGroupContext {
    return true;
  }
}

@Directive({ selector: 'ng-template[suiMultiSelectLoading]' })
export class MultiSelectLoadingTemplate {
  public static ngTemplateContextGuard(
    _directive: MultiSelectLoadingTemplate,
    _context: unknown,
  ): _context is MultiSelectLoadingContext {
    return true;
  }
}

@Directive({ selector: 'ng-template[suiMultiSelectLoadingIcon]' })
export class MultiSelectLoadingIconTemplate {}

@Directive({ selector: 'ng-template[suiMultiSelectDropdownIcon]' })
export class MultiSelectDropdownIconTemplate {}

@Directive({ selector: 'ng-template[suiMultiSelectClearIcon]' })
export class MultiSelectClearIconTemplate {}

@Directive({ selector: 'ng-template[suiMultiSelectCheckmarkIcon]' })
export class MultiSelectCheckmarkIconTemplate {}

@Directive({ selector: 'ng-template[suiMultiSelectHeader]' })
export class MultiSelectHeaderTemplate {
  public static ngTemplateContextGuard(
    _directive: MultiSelectHeaderTemplate,
    _context: unknown,
  ): _context is MultiSelectHeaderContext {
    return true;
  }
}

@Directive({ selector: 'ng-template[suiMultiSelectFooter]' })
export class MultiSelectFooterTemplate {}

@Directive({ selector: 'ng-template[suiMultiSelectEmpty]' })
export class MultiSelectEmptyTemplate {}
