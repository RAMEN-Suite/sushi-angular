import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  input,
  InputSignal,
  InputSignalWithTransform,
  model,
  ModelSignal,
  output,
  OutputEmitterRef,
  Signal,
  TemplateRef,
} from '@angular/core';
import { FormCheckboxControl } from '@angular/forms/signals';
import { Button } from '../button';
import {
  ToggleButtonContext,
  ToggleButtonSeverity,
  ToggleButtonShape,
  ToggleButtonSize,
  ToggleButtonVariant,
} from './toggle-button.interfaces';
import { ToggleButtonOffTemplate, ToggleButtonOnTemplate, ToggleButtonTemplate } from './toggle-button.templates';

@Component({
  selector: 'sui-toggle-button',
  imports: [NgTemplateOutlet, Button],
  templateUrl: './toggle-button.component.html',
  styleUrl: './toggle-button.component.css',
  host: {
    class: 'sui-toggle-button',
    '[class.sui-toggle-button--checked]': 'checked()',
    '[class.sui-toggle-button--disabled]': 'disabled()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToggleButton implements FormCheckboxControl {
  public readonly checked: ModelSignal<boolean> = model<boolean>(false);

  public readonly offLabel: InputSignal<string> = input<string>('Off');
  public readonly onLabel: InputSignal<string> = input<string>('On');
  public readonly ariaLabel: InputSignal<string | null> = input<string | null>(null);

  public readonly severity: InputSignal<ToggleButtonSeverity> = input<ToggleButtonSeverity>('primary');
  public readonly size: InputSignal<ToggleButtonSize> = input<ToggleButtonSize>('md');
  public readonly variant: InputSignal<ToggleButtonVariant | null> = input<ToggleButtonVariant | null>(null);
  public readonly shape: InputSignal<ToggleButtonShape | null> = input<ToggleButtonShape | null>(null);
  public readonly disabled: InputSignalWithTransform<boolean, unknown> = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  public readonly loading: InputSignalWithTransform<boolean, unknown> = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  public readonly touch: OutputEmitterRef<void> = output();

  protected readonly onTemplate: Signal<TemplateRef<void> | undefined> = contentChild(ToggleButtonOnTemplate, {
    read: TemplateRef,
  });
  protected readonly offTemplate: Signal<TemplateRef<void> | undefined> = contentChild(ToggleButtonOffTemplate, {
    read: TemplateRef,
  });
  protected readonly contentTemplate: Signal<TemplateRef<ToggleButtonContext> | undefined> = contentChild(ToggleButtonTemplate, {
    read: TemplateRef,
  });

  protected readonly context: Signal<ToggleButtonContext> = computed<ToggleButtonContext>((): ToggleButtonContext => ({
    $implicit: this.checked(),
    checked: this.checked(),
    disabled: this.disabled(),
    loading: this.loading(),
    toggle: (): void => this.handleToggle(),
    touch: (): void => this.handleBlur(),
  }));

  protected handleBlur(): void {
    this.touch.emit();
  }

  protected handleToggle(): void {
    if (this.disabled() || this.loading()) return;
    const checked: boolean = !this.checked();
    this.checked.set(checked);
  }
}
