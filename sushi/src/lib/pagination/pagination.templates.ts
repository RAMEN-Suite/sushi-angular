import { Directive } from '@angular/core';
import { PaginationNavigationContext, PaginationPageContext, PaginationReportContext } from './pagination.interfaces';

/** Replaces the content of every numbered page action. */
@Directive({ selector: 'ng-template[suiPaginationPage]' })
export class PaginationPageTemplate {
  public static ngTemplateContextGuard(_directive: PaginationPageTemplate, _context: unknown): _context is PaginationPageContext {
    return true;
  }
}

/** Replaces the content of every first, previous, next, and last action. */
@Directive({ selector: 'ng-template[suiPaginationNavigation]' })
export class PaginationNavigationTemplate {
  public static ngTemplateContextGuard(
    _directive: PaginationNavigationTemplate,
    _context: unknown,
  ): _context is PaginationNavigationContext {
    return true;
  }
}

/** Replaces the optional current-page report. */
@Directive({ selector: 'ng-template[suiPaginationReport]' })
export class PaginationReportTemplate {
  public static ngTemplateContextGuard(
    _directive: PaginationReportTemplate,
    _context: unknown,
  ): _context is PaginationReportContext {
    return true;
  }
}
