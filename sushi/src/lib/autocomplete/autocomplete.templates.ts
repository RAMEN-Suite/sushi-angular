import { Directive } from '@angular/core';
import { AutocompleteItemContext, AutocompleteStatusContext } from './autocomplete.interfaces';

/** Replaces each suggestion and exposes its option, index, and selection state. */
@Directive({ selector: 'ng-template[suiAutocompleteItem]' })
export class AutocompleteItemTemplate {
  public static ngTemplateContextGuard(
    _directive: AutocompleteItemTemplate,
    _context: unknown,
  ): _context is AutocompleteItemContext {
    return true;
  }
}

/** Replaces the empty-result message and exposes the current query. */
@Directive({ selector: 'ng-template[suiAutocompleteEmpty]' })
export class AutocompleteEmptyTemplate {
  public static ngTemplateContextGuard(
    _directive: AutocompleteEmptyTemplate,
    _context: unknown,
  ): _context is AutocompleteStatusContext {
    return true;
  }
}

/** Adds content before the native search input. */
@Directive({ selector: 'ng-template[suiAutocompletePrefix]' })
export class AutocompletePrefixTemplate {}

/** Replaces the loading message and exposes the current query. */
@Directive({ selector: 'ng-template[suiAutocompleteLoading]' })
export class AutocompleteLoadingTemplate {
  public static ngTemplateContextGuard(
    _directive: AutocompleteLoadingTemplate,
    _context: unknown,
  ): _context is AutocompleteStatusContext {
    return true;
  }
}

/** Replaces the error message and exposes the current query. */
@Directive({ selector: 'ng-template[suiAutocompleteError]' })
export class AutocompleteErrorTemplate {
  public static ngTemplateContextGuard(
    _directive: AutocompleteErrorTemplate,
    _context: unknown,
  ): _context is AutocompleteStatusContext {
    return true;
  }
}
