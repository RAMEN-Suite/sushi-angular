import { Directive } from '@angular/core';
import { ListItemContext } from './list.interfaces';

/** Renders each row and exposes `$implicit`, `item`, `index`, `count`, `first`, `last`, `even`, and `odd`. */
@Directive({ selector: 'ng-template[suiListItem]' })
export class ListItemTemplate {
  declare public static readonly ngTemplateContextType: ListItemContext<unknown>;
}
