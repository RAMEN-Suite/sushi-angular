import { Directive, input, type InputSignal } from '@angular/core';
import { type NavbarItem } from '../navbar';
import { type SidebarGroup, type SidebarGroupContext, type SidebarItemContext } from './sidebar.interfaces';

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

/** Customizes visible Sidebar group headings without changing navigation items. */
@Directive({ selector: 'ng-template[suiSidebarGroup]' })
export class SidebarGroupTemplate<I extends NavbarItem = NavbarItem, G extends SidebarGroup<I> = SidebarGroup<I>> {
  /** Group source used to infer custom fields inside the template. */
  public readonly groups: InputSignal<readonly G[] | undefined> = input<readonly G[] | undefined>(undefined, {
    alias: 'suiSidebarGroup',
  });

  public static ngTemplateContextGuard<I extends NavbarItem, G extends SidebarGroup<I>>(
    _directive: SidebarGroupTemplate<I, G>,
    _context: unknown,
  ): _context is SidebarGroupContext<I, G> {
    return true;
  }
}
