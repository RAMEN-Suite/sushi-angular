import { NgTemplateOutlet } from '@angular/common';
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
import { MenuEntry, MenuGroupContext, MenuItem, MenuItemContext, MenuSeverity, MenuSize } from '../menu.interfaces';
import { MenuLevel } from './menu-level.component';

/** @internal */
@Component({
  selector: 'sui-menu-surface',
  imports: [MenuLevel, NgTemplateOutlet],
  templateUrl: './menu-surface.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuSurface<I extends MenuItem = MenuItem> {
  public readonly items: InputSignal<readonly MenuEntry<I>[]> = input.required<readonly MenuEntry<I>[]>();
  public readonly id: InputSignal<string> = input.required<string>();
  public readonly ariaLabel: InputSignal<string | null> = input<string | null>(null);
  public readonly ariaLabelledby: InputSignal<string | null> = input<string | null>(null);
  public readonly disabled: InputSignal<boolean> = input<boolean>(false);
  public readonly fluid: InputSignal<boolean> = input<boolean>(false);
  public readonly severity: InputSignal<MenuSeverity> = input<MenuSeverity>('primary');
  public readonly size: InputSignal<MenuSize> = input<MenuSize>('md');
  public readonly wrap: InputSignal<boolean> = input<boolean>(true);
  public readonly typeaheadDelay: InputSignal<number> = input<number>(500);

  public readonly startTemplate: InputSignal<TemplateRef<void> | undefined> = input<TemplateRef<void> | undefined>();
  public readonly endTemplate: InputSignal<TemplateRef<void> | undefined> = input<TemplateRef<void> | undefined>();
  public readonly itemTemplate: InputSignal<TemplateRef<MenuItemContext<I>> | undefined> = input<
    TemplateRef<MenuItemContext<I>> | undefined
  >();
  public readonly groupTemplate: InputSignal<TemplateRef<MenuGroupContext<I>> | undefined> = input<
    TemplateRef<MenuGroupContext<I>> | undefined
  >();

  public readonly itemSelected: OutputEmitterRef<I['value']> = output<I['value']>();

  private readonly level: Signal<MenuLevel<I>> = viewChild.required(MenuLevel<I>);

  public focus(): void {
    this.level().focus();
  }
}
