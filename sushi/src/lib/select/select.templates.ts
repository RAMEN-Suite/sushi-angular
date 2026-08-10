import { Directive } from '@angular/core';
import { SelectGroupContext, SelectItemContext, SelectLoadingContext, SelectSelectedItemContext } from './select.interfaces';

@Directive({ selector: 'ng-template[suiSelectItem]' })
export class SelectItemTemplate {
  public static ngTemplateContextGuard(_directive: SelectItemTemplate, _context: unknown): _context is SelectItemContext {
    return true;
  }
}

@Directive({ selector: 'ng-template[suiSelectSelectedItem]' })
export class SelectSelectedItemTemplate {
  public static ngTemplateContextGuard(
    _directive: SelectSelectedItemTemplate,
    _context: unknown,
  ): _context is SelectSelectedItemContext {
    return true;
  }
}

@Directive({ selector: 'ng-template[suiSelectGroup]' })
export class SelectGroupTemplate {
  public static ngTemplateContextGuard(_directive: SelectGroupTemplate, _context: unknown): _context is SelectGroupContext {
    return true;
  }
}

@Directive({ selector: 'ng-template[suiSelectLoading]' })
export class SelectLoadingTemplate {
  public static ngTemplateContextGuard(_directive: SelectLoadingTemplate, _context: unknown): _context is SelectLoadingContext {
    return true;
  }
}

@Directive({ selector: 'ng-template[suiSelectLoadingIcon]' })
export class SelectLoadingIconTemplate {}

@Directive({ selector: 'ng-template[suiSelectDropdownIcon]' })
export class SelectDropdownIconTemplate {}

@Directive({ selector: 'ng-template[suiSelectClearIcon]' })
export class SelectClearIconTemplate {}

@Directive({ selector: 'ng-template[suiSelectCheckmarkIcon]' })
export class SelectCheckmarkIconTemplate {}

@Directive({ selector: 'ng-template[suiSelectHeader]' })
export class SelectHeaderTemplate {}

@Directive({ selector: 'ng-template[suiSelectFooter]' })
export class SelectFooterTemplate {}

@Directive({ selector: 'ng-template[suiSelectEmpty]' })
export class SelectEmptyTemplate {}
