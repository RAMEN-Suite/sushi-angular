import { Directive, input, InputSignal } from '@angular/core';
import { NavbarItem } from '../navbar';
import { SidebarGroup, SidebarGroupContext } from './sidebar.interfaces';

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
