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

/** Toggles one pressed state while retaining button semantics. */
@Component({
  selector: 'sui-toggle-button',
  imports: [NgTemplateOutlet, Button],
  templateUrl: './toggle-button.component.html',
  host: {
    class: 'inline-flex sui-toggle-button',
    '[class.sui-toggle-button--checked]': 'checked()',
    '[class.sui-toggle-button--disabled]': 'disabled()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToggleButton implements FormCheckboxControl {
  /** Current pressed state. */
  public readonly checked: ModelSignal<boolean> = model<boolean>(false);

  /** Label displayed while the button is not pressed. */
  public readonly offLabel: InputSignal<string> = input<string>('Off');
  /** Label displayed while the button is pressed. */
  public readonly onLabel: InputSignal<string> = input<string>('On');
  /** Accessible label used when the visible content does not name the action. */
  public readonly ariaLabel: InputSignal<string | null> = input<string | null>(null);

  /** Applies one semantic color to both pressed states. */
  public readonly severity: InputSignal<ToggleButtonSeverity> = input<ToggleButtonSeverity>('primary');
  /** Sets the button dimensions. */
  public readonly size: InputSignal<ToggleButtonSize> = input<ToggleButtonSize>('md');
  /** Overrides the unpressed appearance; the pressed state remains filled. */
  public readonly variant: InputSignal<ToggleButtonVariant | null> = input<ToggleButtonVariant | null>(null);
  /** Sets a standard, fluid, square, or circular shape. */
  public readonly shape: InputSignal<ToggleButtonShape | null> = input<ToggleButtonShape | null>(null);
  /** Prevents interaction while keeping the button focusable. */
  public readonly disabled: InputSignalWithTransform<boolean, unknown> = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  /** Shows the button loading state and prevents activation. */
  public readonly loading: InputSignalWithTransform<boolean, unknown> = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  /** Emits when the button loses focus after interaction. */
  public readonly touch: OutputEmitterRef<void> = output();

  protected readonly onTemplate: Signal<TemplateRef<void> | undefined> = contentChild(ToggleButtonOnTemplate, {
    read: TemplateRef,
  });
  protected readonly offTemplate: Signal<TemplateRef<void> | undefined> = contentChild(ToggleButtonOffTemplate, {
    read: TemplateRef,
  });
  protected readonly controlTemplate: Signal<TemplateRef<ToggleButtonContext> | undefined> = contentChild(ToggleButtonTemplate, {
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
