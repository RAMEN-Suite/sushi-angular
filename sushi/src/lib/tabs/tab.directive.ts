import { booleanAttribute, Directive, inject, input, InputSignal, InputSignalWithTransform, TemplateRef } from '@angular/core';
import { TabsValue } from './tabs.interfaces';

@Directive({ selector: 'ng-template[suiTab]' })
export class Tab {
  public readonly value: InputSignal<TabsValue> = input.required<TabsValue>();
  public readonly label: InputSignal<string> = input.required<string>();
  public readonly disabled: InputSignalWithTransform<boolean, unknown> = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  public readonly preserveContent: InputSignalWithTransform<boolean, unknown> = input<boolean, unknown>(true, {
    transform: booleanAttribute,
  });

  public readonly template: TemplateRef<void> = inject<TemplateRef<void>>(TemplateRef);
}
