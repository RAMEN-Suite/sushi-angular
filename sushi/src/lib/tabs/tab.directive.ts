import { booleanAttribute, Directive, inject, input, InputSignal, InputSignalWithTransform, TemplateRef } from '@angular/core';
import { TabsValue } from './tabs.interfaces';

/** Defines one tab label, value, and panel template. */
@Directive({ selector: 'ng-template[suiTab]' })
export class Tab {
  /** Identifies the tab in the parent value model. */
  public readonly value: InputSignal<TabsValue> = input.required<TabsValue>();
  /** Sets the visible tab label. */
  public readonly label: InputSignal<string> = input.required<string>();
  /** Prevents activation of this tab. */
  public readonly disabled: InputSignalWithTransform<boolean, unknown> = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  /** Keeps an inactive panel instantiated when enabled. */
  public readonly preserveContent: InputSignalWithTransform<boolean, unknown> = input<boolean, unknown>(true, {
    transform: booleanAttribute,
  });

  public readonly template: TemplateRef<void> = inject<TemplateRef<void>>(TemplateRef);
}
