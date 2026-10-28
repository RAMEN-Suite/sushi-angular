import { Directive, input, type InputSignal } from '@angular/core';
import { type BreadcrumbItem, type BreadcrumbItemContext } from './breadcrumb.interfaces';

/** Customizes each item while preserving the collection's native semantics. */
@Directive({ selector: 'ng-template[suiBreadcrumbItem]' })
export class BreadcrumbItemTemplate<T = unknown> {
  /** Item source used to infer the template context. */
  public readonly items: InputSignal<readonly BreadcrumbItem<T>[] | '' | undefined> = input<
    readonly BreadcrumbItem<T>[] | '' | undefined
  >(undefined, { alias: 'suiBreadcrumbItem' });

  public static ngTemplateContextGuard<T>(
    _directive: BreadcrumbItemTemplate<T>,
    _context: unknown,
  ): _context is BreadcrumbItemContext<T> {
    return true;
  }
}
