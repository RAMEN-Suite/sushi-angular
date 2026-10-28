import { Directive, input, type InputSignal } from '@angular/core';
import { type ListItemContext } from './list.interfaces';

/** Customizes each item while preserving the collection's native semantics. */
@Directive({ selector: 'ng-template[suiListItem]' })
export class ListItemTemplate<T = unknown> {
  /** Item source used to infer the template context. */
  public readonly items: InputSignal<readonly T[] | '' | undefined> = input<readonly T[] | '' | undefined>(undefined, {
    alias: 'suiListItem',
  });

  public static ngTemplateContextGuard<T>(_directive: ListItemTemplate<T>, _context: unknown): _context is ListItemContext<T> {
    return true;
  }
}
