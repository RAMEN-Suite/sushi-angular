import { Directive, input, InputSignal } from '@angular/core';
import { NavbarItem } from '../navbar';
import { SidebarGroup, SidebarGroupContext } from './sidebar.interfaces';

/** Customizes visible Sidebar group headings without changing navigation items. */
@Directive({ selector: 'ng-template[suiSidebarGroup]' })
export class SidebarGroupTemplate<I extends NavbarItem = NavbarItem> {
  /** Group source used to infer custom fields inside the template. */
  public readonly groups: InputSignal<readonly SidebarGroup<I>[] | undefined> = input<readonly SidebarGroup<I>[] | undefined>(
    undefined,
    { alias: 'suiSidebarGroup' },
  );

  public static ngTemplateContextGuard<I extends NavbarItem>(
    _directive: SidebarGroupTemplate<I>,
    _context: unknown,
  ): _context is SidebarGroupContext<I> {
    return true;
  }
}
