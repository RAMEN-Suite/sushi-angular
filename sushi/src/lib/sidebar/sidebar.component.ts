import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  contentChild,
  input,
  InputSignal,
  model,
  ModelSignal,
  output,
  OutputEmitterRef,
  Signal,
  TemplateRef,
} from '@angular/core';
import { Navbar, NavbarItem, NavbarItemTemplate } from '../navbar';
import { SidebarGroupTemplate } from './sidebar-group-template.directive';
import { SidebarItemTemplate } from './sidebar-item-template.directive';
import { SidebarGroup, SidebarItemContext, SidebarSize } from './sidebar.interfaces';
import { SidebarFooter, SidebarHeader } from './sidebar-slots.directive';

/** Renders persistent, grouped application navigation with optional header and footer regions. */
@Component({
  selector: 'sui-sidebar',
  imports: [Navbar, NavbarItemTemplate, NgTemplateOutlet],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  host: {
    class: 'sui-sidebar',
    role: 'complementary',
    '[attr.aria-label]': 'ariaLabel()',
    '[class.sui-sidebar--sm]': 'size() === "sm"',
    '[class.sui-sidebar--md]': 'size() === "md"',
    '[class.sui-sidebar--lg]': 'size() === "lg"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar<I extends NavbarItem = NavbarItem> {
  /** Labeled navigation groups shown in the scrollable Sidebar body. */
  public readonly groups: InputSignal<readonly SidebarGroup<I>[]> = input<readonly SidebarGroup<I>[]>([]);
  /** Accessible label for the complementary landmark. */
  public readonly ariaLabel: InputSignal<string> = input<string>('Application sidebar');
  /** Controls the persistent Sidebar width. */
  public readonly size: InputSignal<SidebarSize> = input<SidebarSize>('md');
  /** Value of the current destination. */
  public readonly value: ModelSignal<I['value'] | null> = model<I['value'] | null>(null);

  /** Emits the selected destination value. */
  public readonly itemSelected: OutputEmitterRef<I['value']> = output<I['value']>();

  protected readonly header: Signal<SidebarHeader | undefined> = contentChild(SidebarHeader);
  protected readonly footer: Signal<SidebarFooter | undefined> = contentChild(SidebarFooter);
  protected readonly groupTemplate: Signal<TemplateRef<unknown> | undefined> = contentChild(SidebarGroupTemplate, {
    read: TemplateRef,
  });
  protected readonly itemTemplate: Signal<TemplateRef<SidebarItemContext<I>> | undefined> = contentChild(SidebarItemTemplate, {
    read: TemplateRef,
  });

  protected selectItem(value: I['value']): void {
    this.value.set(value);
    this.itemSelected.emit(value);
  }
}
