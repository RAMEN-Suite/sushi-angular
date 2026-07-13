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
import { SuiButton } from '../../button';
import { SuiBooleanInput, SuiBooleanInputValue, SuiTemplate } from '../../sushi.types';
import {
  SuiToggleButtonAnimation,
  SuiToggleButtonContext,
  SuiToggleButtonSeverity,
  SuiToggleButtonShape,
  SuiToggleButtonSize,
  SuiToggleButtonVariant,
} from '../toggle-button.interfaces';
import { SuiToggleButtonOffTemplate, SuiToggleButtonOnTemplate, SuiToggleButtonTemplate } from '../toggle-button.templates';

@Component({
  selector: 'sui-toggle-button',
  standalone: true,
  imports: [NgTemplateOutlet, SuiButton],
  templateUrl: './toggle-button.component.html',
  styleUrl: './toggle-button.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef((): typeof SuiToggleButton => SuiToggleButton),
      multi: true,
    },
  ],
  host: {
    class: 'sui-toggle-button',
    '[class.sui-toggle-button--checked]': 'checked()',
    '[class.sui-toggle-button--disabled]': 'isDisabled()',
  },
})
export class SuiToggleButton implements ControlValueAccessor {
  public readonly checked: ModelSignal<boolean> = model<boolean>(false);
  public readonly offLabel: InputSignal<string> = input<string>('Off');
  public readonly onLabel: InputSignal<string> = input<string>('On');
  public readonly ariaLabel: InputSignal<string | null> = input<string | null>(null);

  public readonly animation: InputSignal<SuiToggleButtonAnimation> = input<SuiToggleButtonAnimation>('none');
  public readonly severity: InputSignal<SuiToggleButtonSeverity> = input<SuiToggleButtonSeverity>('primary');
  public readonly variant: InputSignal<SuiToggleButtonVariant | null> = input<SuiToggleButtonVariant | null>(null);
  public readonly size: InputSignal<SuiToggleButtonSize> = input<SuiToggleButtonSize>('md');
  public readonly shape: InputSignal<SuiToggleButtonShape> = input<SuiToggleButtonShape>('default');

  public readonly disabled: SuiBooleanInput = input<boolean, SuiBooleanInputValue>(false, { transform: booleanAttribute });
  public readonly loading: SuiBooleanInput = input<boolean, SuiBooleanInputValue>(false, { transform: booleanAttribute });

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

  protected readonly buttonTemplate: SuiTemplate<SuiToggleButtonContext> = contentChild(SuiToggleButtonTemplate, {
    read: TemplateRef,
  });
  protected readonly offTemplate: SuiTemplate<void> = contentChild(SuiToggleButtonOffTemplate, { read: TemplateRef });
  protected readonly onTemplate: SuiTemplate<void> = contentChild(SuiToggleButtonOnTemplate, { read: TemplateRef });

  protected readonly hasInteracted: WritableSignal<boolean> = signal<boolean>(false);
  protected readonly isDisabled: Signal<boolean> = computed<boolean>((): boolean => this.disabled() || this.isFormDisabled());
  protected readonly context: Signal<SuiToggleButtonContext> = computed<SuiToggleButtonContext>((): SuiToggleButtonContext => ({
    $implicit: this.checked(),
    checked: this.checked(),
    disabled: this.isDisabled(),
    loading: this.loading(),
    toggle: (): void => this.toggle(),
  }));

  protected handleClick(): void {
    this.toggle();
  }

  protected handleBlur(): void {
    this.onTouched();
  }

  protected toggle(): void {
    if (this.isDisabled() || this.loading()) return;
    const checked: boolean = !this.checked();
    this.hasInteracted.set(true);

    this.checked.set(checked);
    this.onChange(checked);
  }

  private readonly isFormDisabled: WritableSignal<boolean> = signal<boolean>(false);
  private onChange: (checked: boolean) => void = (): undefined => undefined;
  private onTouched: () => void = (): undefined => undefined;
}
