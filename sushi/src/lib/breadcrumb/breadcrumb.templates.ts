import { Directive } from '@angular/core';
import { BreadcrumbItemContext } from './breadcrumb.interfaces';

/** Replaces each Breadcrumb label while preserving navigation semantics. */
@Directive({ selector: 'ng-template[suiBreadcrumbItem]' })
export class BreadcrumbItemTemplate {
  declare public static readonly ngTemplateContextType: BreadcrumbItemContext<unknown>;
}
