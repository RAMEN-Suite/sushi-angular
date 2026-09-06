import { Directive, input, InputSignal } from '@angular/core';
import { NavbarItem, NavbarItemContext } from './navbar.interfaces';

/** Customizes the visible content of every item rendered from the Navbar model. */
@Directive({ selector: 'ng-template[suiNavbarItem]' })
export class NavbarItemTemplate<I extends NavbarItem = NavbarItem> {
  /** Item source used to infer custom fields inside the template. */
  public readonly items: InputSignal<readonly I[] | undefined> = input<readonly I[] | undefined>(undefined, {
    alias: 'suiNavbarItem',
  });

  public static ngTemplateContextGuard<I extends NavbarItem>(
    _directive: NavbarItemTemplate<I>,
    _context: unknown,
  ): _context is NavbarItemContext<I> {
    return true;
  }
}
