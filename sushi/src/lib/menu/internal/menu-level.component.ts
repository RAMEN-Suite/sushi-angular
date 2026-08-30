import { NgTemplateOutlet } from '@angular/common';
import { Menu as AriaMenu } from '@angular/aria/menu';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
  Signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { Divider } from '../../divider';
import { MenuAction } from './menu-action.component';
import {
  MenuEntry,
  MenuGroup,
  MenuGroupContext,
  MenuItem,
  MenuItemContext,
  MenuSeparator,
  MenuSeverity,
  MenuSize,
} from '../menu.interfaces';

/** @internal */
@Component({
  selector: 'sui-menu-level',
  imports: [AriaMenu, Divider, MenuAction, NgTemplateOutlet],
  templateUrl: './menu-level.component.html',
  styleUrl: './menu-level.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuLevel<I extends MenuItem = MenuItem> {
  public readonly items: InputSignal<readonly MenuEntry<I>[]> = input.required<readonly MenuEntry<I>[]>();
  public readonly id: InputSignal<string> = input.required<string>();
  public readonly ariaLabel: InputSignal<string | null> = input<string | null>(null);
  public readonly ariaLabelledby: InputSignal<string | null> = input<string | null>(null);
  public readonly disabled: InputSignal<boolean> = input<boolean>(false);
  public readonly nested: InputSignal<boolean> = input<boolean>(false);
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

  public readonly ariaMenu: Signal<AriaMenu<I['value']>> = viewChild.required(AriaMenu<I['value']>);

  public focus(): void {
    this.ariaMenu()._pattern.first();
  }

  protected isGroup(entry: MenuEntry<I>): entry is MenuGroup<I> {
    return 'type' in entry && entry.type === 'group';
  }

  protected isSeparator(entry: MenuEntry<I>): entry is MenuSeparator {
    return 'type' in entry && entry.type === 'separator';
  }

  protected groupContext(group: MenuGroup<I>): MenuGroupContext<I> {
    return { $implicit: group, group };
  }

  protected groupId(index: number): string {
    return `${this.id()}-group-${index}`;
  }
}
