import { NgTemplateOutlet } from '@angular/common';
import {
  Tab as AriaTab,
  TabContent as AriaTabContent,
  TabList as AriaTabList,
  TabPanel as AriaTabPanel,
  Tabs as AriaTabs,
} from '@angular/aria/tabs';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  input,
  InputSignal,
  InputSignalWithTransform,
  model,
  ModelSignal,
  Signal,
} from '@angular/core';
import { Tab } from './tab.directive';
import {
  TabsFocusMode,
  TabsOrientation,
  TabsPlacement,
  TabsSelectionMode,
  TabsSize,
  TabsValue,
  TabsVariant,
} from './tabs.interfaces';

@Component({
  selector: 'sui-tabs',
  imports: [AriaTab, AriaTabContent, AriaTabList, AriaTabPanel, AriaTabs, NgTemplateOutlet],
  templateUrl: './tabs.component.html',
  host: { class: 'sui-tabs block min-w-0' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tabs {
  public readonly value: ModelSignal<TabsValue> = model.required<TabsValue>();
  public readonly variant: InputSignal<TabsVariant> = input<TabsVariant>('plain');
  public readonly size: InputSignal<TabsSize> = input<TabsSize>('md');
  public readonly orientation: InputSignal<TabsOrientation> = input<TabsOrientation>('horizontal');
  public readonly placement: InputSignal<TabsPlacement> = input<TabsPlacement>('top');
  public readonly selectionMode: InputSignal<TabsSelectionMode> = input<TabsSelectionMode>('follow');
  public readonly focusMode: InputSignal<TabsFocusMode> = input<TabsFocusMode>('roving');
  public readonly ariaLabel: InputSignal<string> = input<string>('Tabs');
  public readonly wrap: InputSignalWithTransform<boolean, unknown> = input<boolean, unknown>(true, {
    transform: booleanAttribute,
  });
  public readonly softDisabled: InputSignalWithTransform<boolean, unknown> = input<boolean, unknown>(true, {
    transform: booleanAttribute,
  });
  public readonly disabled: InputSignalWithTransform<boolean, unknown> = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });

  protected readonly tabs: Signal<readonly Tab[]> = contentChildren(Tab);
}
