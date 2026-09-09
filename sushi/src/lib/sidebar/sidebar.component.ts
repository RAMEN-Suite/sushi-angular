import { NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  input,
  InputSignal,
  model,
  ModelSignal,
  Signal,
  TemplateRef,
} from '@angular/core';
import { Navbar, NavbarItem, NavbarItemTemplate } from '../navbar';
import { Menu, MenuItemTemplate, MenuTrigger } from '../menu';
import { SidebarGroupTemplate } from './sidebar-group-template.directive';
import { SidebarItemTemplate } from './sidebar-item-template.directive';
import { SidebarGroup, SidebarGroupContext, SidebarItemContext, SidebarSize } from './sidebar.interfaces';
import { SidebarFooter, SidebarHeader } from './sidebar-slots.directive';

/** Renders persistent, grouped application navigation with optional header and footer regions. */
@Component({
  selector: 'sui-sidebar',
  imports: [Menu, MenuItemTemplate, MenuTrigger, Navbar, NavbarItemTemplate, NgTemplateOutlet, RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  host: {
    class: 'sui-sidebar',
    role: 'complementary',
    '[attr.aria-label]': 'ariaLabel()',
    '[class.sui-sidebar--sm]': 'size() === "sm"',
    '[class.sui-sidebar--md]': 'size() === "md"',
    '[class.sui-sidebar--lg]': 'size() === "lg"',
    '[class.sui-sidebar--collapsed]': 'collapsed()',
    '[attr.data-collapsed]': 'collapsed() ? "" : null',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar<I extends NavbarItem = NavbarItem> {
  /** Typed navigation groups shown in the scrollable body and reused across persistent and Drawer layouts. */
  public readonly groups: InputSignal<readonly SidebarGroup<I>[]> = input<readonly SidebarGroup<I>[]>([]);
  /** Accessible label for the complementary landmark. */
  public readonly ariaLabel: InputSignal<string> = input<string>('Application sidebar');
  /** Controls the persistent Sidebar width. */
  public readonly size: InputSignal<SidebarSize> = input<SidebarSize>('md');
  /** Value of the current destination. */
  public readonly value: ModelSignal<I['value'] | null> = model<I['value'] | null>(null);
  /** Reduces the Sidebar to an icon rail and hides default headings and item labels. Custom templates receive the collapsed state. */
  public readonly collapsed: ModelSignal<boolean> = model<boolean>(false);

  protected readonly header: Signal<SidebarHeader | undefined> = contentChild(SidebarHeader);
  protected readonly footer: Signal<SidebarFooter | undefined> = contentChild(SidebarFooter);
  protected readonly groupTemplate: Signal<TemplateRef<SidebarGroupContext<I>> | undefined> = contentChild(SidebarGroupTemplate, {
    read: TemplateRef,
  });
  protected readonly itemTemplate: Signal<TemplateRef<SidebarItemContext<I>> | undefined> = contentChild(SidebarItemTemplate, {
    read: TemplateRef,
  });
  protected readonly renderedGroups: Signal<readonly SidebarGroup<I>[]> = computed(() =>
    this.groups().filter((group: SidebarGroup<I>): boolean => group.items.length > 0),
  );

  protected selectItem(value: I['value']): void {
    this.value.set(value);
  }

  protected isCurrent(item: NavbarItem<I['value']>): boolean {
    return item.active === true || item.value === this.value();
  }

  protected hasCurrentChild(item: NavbarItem<I['value']>): boolean {
    return item.items?.some((child: NavbarItem<I['value']>): boolean => this.isCurrent(child)) ?? false;
  }

  protected selectRailItem(item: I, event: Event): void {
    if (item.disabled) {
      event.preventDefault();
      return;
    }
    this.selectItem(item.value);
  }
}
