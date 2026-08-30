import { Directive, input, InputSignal } from '@angular/core';
import { MenuEntry, MenuGroupContext, MenuItem, MenuItemContext } from './menu.interfaces';

/** Replaces the content rendered before all menu entries. */
@Directive({ selector: 'ng-template[suiMenuStart]' })
export class MenuStartTemplate {}

/** Replaces the content rendered after all menu entries. */
@Directive({ selector: 'ng-template[suiMenuEnd]' })
export class MenuEndTemplate {}

/** Customizes every selectable menu action. */
@Directive({ selector: 'ng-template[suiMenuItem]' })
export class MenuItemTemplate<I extends MenuItem = MenuItem> {
  /** Item source used to infer custom item fields inside the template. */
  public readonly items: InputSignal<readonly MenuEntry<I>[] | undefined> = input<readonly MenuEntry<I>[] | undefined>(
    undefined,
    { alias: 'suiMenuItem' },
  );

  public static ngTemplateContextGuard<I extends MenuItem>(
    _directive: MenuItemTemplate<I>,
    _context: unknown,
  ): _context is MenuItemContext<I> {
    return true;
  }
}

/** Customizes every menu group heading. */
@Directive({ selector: 'ng-template[suiMenuGroup]' })
export class MenuGroupTemplate<I extends MenuItem = MenuItem> {
  /** Item source used to infer the custom group item type inside the template. */
  public readonly items: InputSignal<readonly MenuEntry<I>[] | undefined> = input<readonly MenuEntry<I>[] | undefined>(
    undefined,
    { alias: 'suiMenuGroup' },
  );

  public static ngTemplateContextGuard<I extends MenuItem>(
    _directive: MenuGroupTemplate<I>,
    _context: unknown,
  ): _context is MenuGroupContext<I> {
    return true;
  }
}
