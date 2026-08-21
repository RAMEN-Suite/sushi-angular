import {
  booleanAttribute,
  computed,
  Directive,
  input,
  InputSignal,
  InputSignalWithTransform,
  numberAttribute,
  Signal,
} from '@angular/core';
import { ButtonSeverity, ButtonShape, ButtonSize, ButtonVariant } from './button.interfaces';

@Directive({
  selector: 'button[suiButton], a[suiButton]',
  host: {
    class: 'btn sui-button',

    '[class.btn-primary]': 'severity() === "primary"',
    '[class.btn-secondary]': 'severity() === "secondary"',
    '[class.btn-neutral]': 'severity() === "neutral"',
    '[class.btn-accent]': 'severity() === "accent"',
    '[class.btn-info]': 'severity() === "info"',
    '[class.btn-success]': 'severity() === "success"',
    '[class.btn-warning]': 'severity() === "warning"',
    '[class.btn-error]': 'severity() === "error"',

    '[class.btn-link]': 'variant() === "link"',
    '[class.btn-soft]': 'variant() === "soft"',
    '[class.btn-dash]': 'variant() === "dash"',
    '[class.btn-outline]': 'variant() === "outlined"',
    '[class.btn-ghost]': 'variant() === "text"',

    '[class.btn-xs]': 'size() === "xs"',
    '[class.btn-sm]': 'size() === "sm"',
    '[class.btn-md]': 'size() === "md"',
    '[class.btn-lg]': 'size() === "lg"',
    '[class.btn-xl]': 'size() === "xl"',

    '[class.btn-block]': 'shape() === "fluid"',
    '[class.btn-circle]': 'shape() === "circle"',
    '[class.btn-square]': 'shape() === "square"',

    '[class.sui-button--disabled]': 'isDisabled()',

    '[attr.aria-busy]': 'loading() ? "true" : null',
    '[attr.aria-disabled]': 'isDisabled() ? "true" : null',
    '[attr.disabled]': 'null',
    '[attr.tabindex]': 'tabIndex()',

    '(click)': 'handleClick($event)',
  },
})
/** Styles native buttons and links while preserving their platform semantics. */
export class Button {
  /** Applies a semantic theme color. */
  public readonly severity: InputSignal<ButtonSeverity> = input<ButtonSeverity>('primary');
  /** Controls the button dimensions. */
  public readonly size: InputSignal<ButtonSize> = input<ButtonSize>('md');
  /** Changes the visual treatment of the button. */
  public readonly variant: InputSignal<ButtonVariant | null> = input<ButtonVariant | null>(null);
  /** Changes the button width or geometry. */
  public readonly shape: InputSignal<ButtonShape | null> = input<ButtonShape | null>(null);
  /** Controls keyboard order when the button participates in a composite widget. */
  public readonly tabIndex: InputSignalWithTransform<number | null, unknown> = input<number | null, unknown>(null, {
    transform: (value: unknown): number | null => (value === null || value === undefined ? null : numberAttribute(value)),
  });

  /** Prevents pointer and keyboard activation. */
  public readonly disabled: InputSignalWithTransform<boolean, unknown> = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  /** Marks the action as busy and prevents activation. */
  public readonly loading: InputSignalWithTransform<boolean, unknown> = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });

  protected readonly isDisabled: Signal<boolean> = computed<boolean>((): boolean => this.disabled() || this.loading());

  protected handleClick(event: Event): void {
    if (!this.isDisabled()) return;
    event.preventDefault();
    event.stopImmediatePropagation();
  }
}
