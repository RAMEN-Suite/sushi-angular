import { ComponentSize, ThemeSeverity } from '../sushi.types';

/** Primitive value emitted when a menu action is selected. */
export type MenuValue = string | number;

/** Selectable action rendered by a Menu. */
export interface MenuItem<T extends MenuValue = MenuValue> {
  /** Text used for rendering, typeahead, and the accessible name. */
  readonly label: string;
  /** Value emitted when the action is selected. */
  readonly value: T;
  /** Nested actions opened as a submenu. */
  readonly items?: readonly MenuEntry<MenuItem<T>>[];
  /** Marks the action as the current destination or persistent state. */
  readonly active?: boolean;
  /** Prevents activation and removes the action from keyboard navigation. */
  readonly disabled?: boolean;
}

/** Theme color used for pressed and active menu actions. */
export type MenuSeverity = ThemeSeverity;

/** Size scale available to menus. */
export type MenuSize = ComponentSize;

/** Preferred side of a popup Menu relative to its trigger. */
export type MenuPlacement = 'bottom' | 'right';

/** Labeled collection of related menu actions. */
export interface MenuGroup<I extends MenuItem = MenuItem> {
  /** Identifies the entry as a group. */
  readonly type: 'group';
  /** Accessible and visible heading for the grouped actions. */
  readonly label: string;
  /** Actions contained by the group. */
  readonly items: readonly I[];
}

/** Visual separator between adjacent menu actions. */
export interface MenuSeparator {
  /** Identifies the entry as a separator. */
  readonly type: 'separator';
}

/** Entry accepted by a Menu model. */
export type MenuEntry<I extends MenuItem = MenuItem> = I | MenuGroup<I> | MenuSeparator;

/** Context exposed to a custom menu item template. */
export interface MenuItemContext<I extends MenuItem = MenuItem> {
  /** Menu item available as the implicit template value. */
  readonly $implicit: I;
  /** Menu item available by its explicit context name. */
  readonly item: I;
  /** Whether keyboard navigation or persistent state marks the item active. */
  readonly active: boolean;
}

/** Context exposed to a custom menu group template. */
export interface MenuGroupContext<I extends MenuItem = MenuItem> {
  /** Menu group available as the implicit template value. */
  readonly $implicit: MenuGroup<I>;
  /** Menu group available by its explicit context name. */
  readonly group: MenuGroup<I>;
}
