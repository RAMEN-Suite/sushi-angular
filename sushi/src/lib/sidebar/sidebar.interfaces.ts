import { NavbarItem, NavbarItemContext } from '../navbar';

/** Supported persistent Sidebar widths. */
export type SidebarSize = 'sm' | 'md' | 'lg';

/** Labeled destination group rendered by a Sidebar. */
export interface SidebarGroup<I extends NavbarItem = NavbarItem> {
  /** Accessible group label and default visible heading. Keep labels unique within one Sidebar. */
  readonly label: string;
  /** Draws a separator before this group. Use it to divide navigation regions. */
  readonly dividerBefore?: boolean;
  /** Optional visible heading override. Set `null` to keep only the accessible label. */
  readonly heading?: string | null;
  /** Destinations rendered through the Navbar item model. */
  readonly items: readonly I[];
}

/** Context exposed to a custom Sidebar item template. */
export interface SidebarItemContext<I extends NavbarItem = NavbarItem> extends NavbarItemContext<I> {
  /** Group containing the rendered item. */
  readonly group: SidebarGroup<I>;
  /** Whether the Sidebar currently renders as an icon rail. Use it to hide item labels and supporting content. */
  readonly collapsed: boolean;
}

/** Context exposed to a custom Sidebar group-heading template. */
export interface SidebarGroupContext<I extends NavbarItem = NavbarItem> {
  /** Sidebar group available as the implicit template value. */
  readonly $implicit: SidebarGroup<I>;
  /** Sidebar group available by its explicit context name. */
  readonly group: SidebarGroup<I>;
  /** Whether the Sidebar currently renders as an icon rail. Use it to hide text or show a meaningful group icon. */
  readonly collapsed: boolean;
}
