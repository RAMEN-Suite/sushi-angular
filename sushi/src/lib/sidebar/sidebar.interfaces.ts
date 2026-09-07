import { NavbarItem, NavbarItemContext } from '../navbar';

/** Supported persistent Sidebar widths. */
export type SidebarSize = 'sm' | 'md' | 'lg';

/** Labeled destination group rendered by a Sidebar. */
export interface SidebarGroup<I extends NavbarItem = NavbarItem> {
  /** Visible and accessible group label. Keep labels unique within one Sidebar. */
  readonly label: string;
  /** Visible group heading. Set `null` to keep only the accessible label. */
  readonly heading?: string | null;
  /** Destinations rendered through the Navbar item model. */
  readonly items: readonly I[];
}

/** Context exposed to a custom Sidebar item template. */
export interface SidebarItemContext<I extends NavbarItem = NavbarItem> extends NavbarItemContext<I> {
  /** Group containing the rendered item. */
  readonly group: SidebarGroup<I>;
}

/** Context exposed to a custom Sidebar group-heading template. */
export interface SidebarGroupContext<I extends NavbarItem = NavbarItem> {
  readonly $implicit: SidebarGroup<I>;
  readonly group: SidebarGroup<I>;
}
