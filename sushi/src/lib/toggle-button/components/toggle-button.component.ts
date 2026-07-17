import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  Component,
  computed,
  contentChild,
  forwardRef,
  input,
  InputSignal,
  model,
  ModelSignal,
  signal,
  Signal,
  TemplateRef,
  WritableSignal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Button } from '../../button';
import { BooleanInput, BooleanInputValue, Template } from '../../sushi.types';
import {
  ToggleButtonAnimation,
  ToggleButtonContext,
  ToggleButtonSeverity,
  ToggleButtonShape,
  ToggleButtonSize,
  ToggleButtonVariant,
} from '../toggle-button.interfaces';
import { ToggleButtonOffTemplate, ToggleButtonOnTemplate, ToggleButtonTemplate } from '../toggle-button.templates';

@Component({
  selector: 'sui-toggle-button',
  standalone: true,
  imports: [NgTemplateOutlet, Button],
  templateUrl: './toggle-button.component.html',
  styleUrl: './toggle-button.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef((): typeof ToggleButton => ToggleButton),
      multi: true,
    },
  ],
  host: {
    class: 'sui-toggle-button',
    '[class.sui-toggle-button--checked]': 'checked()',
    '[class.sui-toggle-button--disabled]': 'isDisabled()',
  },
})
export class ToggleButton implements ControlValueAccessor {
  public readonly checked: ModelSignal<boolean> = model<boolean>(false);

  public readonly offLabel: InputSignal<string> = input<string>('Off');
  public readonly onLabel: InputSignal<string> = input<string>('On');
  public readonly ariaLabel: InputSignal<string | null> = input<string | null>(null);

  public readonly severity: InputSignal<ToggleButtonSeverity> = input<ToggleButtonSeverity>('primary');
  public readonly size: InputSignal<ToggleButtonSize> = input<ToggleButtonSize>('md');
  public readonly variant: InputSignal<ToggleButtonVariant | null> = input<ToggleButtonVariant | null>(null);
  public readonly shape: InputSignal<ToggleButtonShape | null> = input<ToggleButtonShape | null>(null);
  public readonly animation: InputSignal<ToggleButtonAnimation | null> = input<ToggleButtonAnimation | null>(null);

  public readonly disabled: BooleanInput = input<boolean, BooleanInputValue>(false, { transform: booleanAttribute });
  public readonly loading: BooleanInput = input<boolean, BooleanInputValue>(false, { transform: booleanAttribute });

  protected readonly buttonOnRef: Template<void> = contentChild(ToggleButtonOnTemplate, { read: TemplateRef });
  protected readonly buttonOffRef: Template<void> = contentChild(ToggleButtonOffTemplate, { read: TemplateRef });
  protected readonly buttonRef: Template<ToggleButtonContext> = contentChild(ToggleButtonTemplate, { read: TemplateRef });

  protected readonly hasInteracted: WritableSignal<boolean> = signal<boolean>(false);
  protected readonly isDisabled: Signal<boolean> = computed<boolean>((): boolean => this.disabled() || this.isFormDisabled());
  protected readonly context: Signal<ToggleButtonContext> = computed<ToggleButtonContext>((): ToggleButtonContext => ({
    $implicit: this.checked(),
    checked: this.checked(),
    disabled: this.isDisabled(),
    loading: this.loading(),
    toggle: (): void => this.handleToggle(),
  }));

  private readonly isFormDisabled: WritableSignal<boolean> = signal<boolean>(false);
  private onChange: (checked: boolean) => void = (): undefined => undefined;
  private onTouched: () => void = (): undefined => undefined;

  public writeValue(value: boolean | null | undefined): void {
    this.checked.set(value ?? false);
  }

  public registerOnChange(callback: (checked: boolean) => void): void {
    this.onChange = callback;
  }

  public registerOnTouched(callback: () => void): void {
    this.onTouched = callback;
  }

  public setDisabledState(disabled: boolean): void {
    this.isFormDisabled.set(disabled);
  }

  protected handleBlur(): void {
    this.onTouched();
  }

  protected handleToggle(): void {
    if (this.isDisabled() || this.loading()) return;
    const checked: boolean = !this.checked();
    this.hasInteracted.set(true);

    this.checked.set(checked);
    this.onChange(checked);
  }
}
