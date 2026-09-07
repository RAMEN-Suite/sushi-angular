import { Directive, input, InputSignal } from '@angular/core';
import { NavbarItem } from '../navbar';
import { SidebarGroup, SidebarItemContext } from './sidebar.interfaces';

/** Customizes each destination rendered from Sidebar groups. */
@Directive({ selector: 'ng-template[suiSidebarItem]' })
export class SidebarItemTemplate<I extends NavbarItem = NavbarItem> {
  /** Group source used to infer custom item fields inside the template. */
  public readonly groups: InputSignal<readonly SidebarGroup<I>[] | undefined> = input<readonly SidebarGroup<I>[] | undefined>(
    undefined,
    {
      alias: 'suiSidebarItem',
    },
  );

  public static ngTemplateContextGuard<I extends NavbarItem>(
    _directive: SidebarItemTemplate<I>,
    _context: unknown,
  ): _context is SidebarItemContext<I> {
    return true;
  }
}
