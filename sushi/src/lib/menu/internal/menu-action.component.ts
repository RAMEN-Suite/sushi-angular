import { NgTemplateOutlet } from '@angular/common';
import { MenuItem as AriaMenuItem } from '@angular/aria/menu';
import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
  TemplateRef,
} from '@angular/core';
import { LucideChevronRight } from '@lucide/angular';
import { MenuGroupContext, MenuItem, MenuItemContext, MenuSeverity, MenuSize } from '../menu.interfaces';
import { MenuLevel } from './menu-level.component';

let nextMenuActionId: number = 0;

/** @internal */
@Component({
  selector: 'sui-menu-action',
  imports: [AriaMenuItem, forwardRef(() => MenuLevel), LucideChevronRight, NgTemplateOutlet],
  templateUrl: './menu-action.component.html',
  styleUrl: './menu-action.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuAction<I extends MenuItem = MenuItem> {
  public readonly item: InputSignal<I> = input.required<I>();
  public readonly menuId: InputSignal<string> = input.required<string>();
  public readonly disabled: InputSignal<boolean> = input<boolean>(false);
  public readonly severity: InputSignal<MenuSeverity> = input<MenuSeverity>('primary');
  public readonly size: InputSignal<MenuSize> = input<MenuSize>('md');
  public readonly wrap: InputSignal<boolean> = input<boolean>(true);
  public readonly typeaheadDelay: InputSignal<number> = input<number>(500);
  public readonly itemTemplate: InputSignal<TemplateRef<MenuItemContext<I>> | undefined> = input<
    TemplateRef<MenuItemContext<I>> | undefined
  >();
  public readonly groupTemplate: InputSignal<TemplateRef<MenuGroupContext<I>> | undefined> = input<
    TemplateRef<MenuGroupContext<I>> | undefined
  >();

  public readonly itemSelected: OutputEmitterRef<I['value']> = output<I['value']>();

  private readonly actionId: number = ++nextMenuActionId;

  protected handleSubmenu(event: Event, item: AriaMenuItem<I['value']>): void {
    if (this.disabled() || this.item().disabled) {
      event.preventDefault();
      return;
    }
    event.stopPropagation();
    item.open();
  }

  protected handleAction(event: Event): void {
    if (!this.disabled() && !this.item().disabled) return;
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  protected itemContext(active: boolean): MenuItemContext<I> {
    const item: I = this.item();
    return { $implicit: item, item, active };
  }

  protected submenuId(): string {
    return `${this.menuId()}-submenu-${this.actionId}`;
  }
}
