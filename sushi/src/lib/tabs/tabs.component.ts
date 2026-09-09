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
import { TabsOrientation, TabsPlacement, TabsSelectionMode, TabsSize, TabsValue, TabsVariant } from './tabs.interfaces';

@Component({
  selector: 'sui-tabs',
  imports: [AriaTab, AriaTabContent, AriaTabList, AriaTabPanel, AriaTabs, NgTemplateOutlet],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.css',
  host: { class: 'sui-tabs block min-w-0' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/** Switches between related templated views with Angular Aria keyboard behavior. */
export class Tabs {
  /** Controls and reports the active tab value. */
  public readonly value: ModelSignal<TabsValue> = model.required<TabsValue>();
  /** Changes the tab list and panel treatment. */
  public readonly variant: InputSignal<TabsVariant> = input<TabsVariant>('plain');
  /** Controls tab dimensions. */
  public readonly size: InputSignal<TabsSize> = input<TabsSize>('md');
  /** Controls the tab list axis and arrow-key direction. */
  public readonly orientation: InputSignal<TabsOrientation> = input<TabsOrientation>('horizontal');
  /** Places a horizontal tab list above or below its panel. */
  public readonly placement: InputSignal<TabsPlacement> = input<TabsPlacement>('top');
  /** Selects tabs on focus or waits for explicit activation. */
  public readonly selectionMode: InputSignal<TabsSelectionMode> = input<TabsSelectionMode>('follow');
  /** Provides an accessible name when the tab list has no visible heading. */
  public readonly ariaLabel: InputSignal<string | null> = input<string | null>('Tabs');
  /** References a visible heading that names the tab list. */
  public readonly ariaLabelledby: InputSignal<string | null> = input<string | null>(null);
  /** Allows arrow-key navigation to wrap between the first and last tab. */
  public readonly wrap: InputSignalWithTransform<boolean, unknown> = input<boolean, unknown>(true, {
    transform: booleanAttribute,
  });
  /** Keeps disabled tabs in the arrow-key sequence while still preventing activation. */
  public readonly softDisabled: InputSignalWithTransform<boolean, unknown> = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  /** Disables the complete tab set. */
  public readonly disabled: InputSignalWithTransform<boolean, unknown> = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });

  protected readonly tabs: Signal<readonly Tab[]> = contentChildren(Tab);
}
