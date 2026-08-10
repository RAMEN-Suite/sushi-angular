import { Directive } from '@angular/core';
import { AutocompleteItemContext, AutocompleteStatusContext } from './autocomplete.interfaces';

@Directive({ selector: 'ng-template[suiAutocompleteItem]' })
export class AutocompleteItemTemplate {
  public static ngTemplateContextGuard(
    _directive: AutocompleteItemTemplate,
    _context: unknown,
  ): _context is AutocompleteItemContext {
    return true;
  }
}

@Directive({ selector: 'ng-template[suiAutocompleteEmpty]' })
export class AutocompleteEmptyTemplate {
  public static ngTemplateContextGuard(
    _directive: AutocompleteEmptyTemplate,
    _context: unknown,
  ): _context is AutocompleteStatusContext {
    return true;
  }
}

@Directive({ selector: 'ng-template[suiAutocompletePrefix]' })
export class AutocompletePrefixTemplate {}

@Directive({ selector: 'ng-template[suiAutocompleteLoading]' })
export class AutocompleteLoadingTemplate {
  public static ngTemplateContextGuard(
    _directive: AutocompleteLoadingTemplate,
    _context: unknown,
  ): _context is AutocompleteStatusContext {
    return true;
  }
}

@Directive({ selector: 'ng-template[suiAutocompleteError]' })
export class AutocompleteErrorTemplate {
  public static ngTemplateContextGuard(
    _directive: AutocompleteErrorTemplate,
    _context: unknown,
  ): _context is AutocompleteStatusContext {
    return true;
  }
}
