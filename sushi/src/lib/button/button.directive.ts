import { booleanAttribute, Directive, ElementRef, HostListener, inject, input, InputSignal } from '@angular/core';
import { BooleanInput, BooleanInputValue } from '../sushi.types';
import { ButtonSeverity, ButtonShape, ButtonSize, ButtonVariant } from './button.interfaces';

@Directive({
  selector: 'button[suiButton], a[suiButton]',
  standalone: true,
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

    '[class.sui-button-control--disabled]': 'disabled()',

    '[attr.aria-busy]': 'loading() ? "true" : null',
    '[attr.aria-disabled]': 'disabled() ? "true" : null',
    '[attr.disabled]': 'disabled() && isNativeButton ? "" : null',
    '[attr.tabindex]': 'disabled() && !isNativeButton ? -1 : null',
  },
})
export class Button {
  public readonly severity: InputSignal<ButtonSeverity> = input<ButtonSeverity>('primary');
  public readonly size: InputSignal<ButtonSize> = input<ButtonSize>('md');
  public readonly variant: InputSignal<ButtonVariant | null> = input<ButtonVariant | null>(null);
  public readonly shape: InputSignal<ButtonShape | null> = input<ButtonShape | null>(null);

  public readonly disabled: BooleanInput = input<boolean, BooleanInputValue>(false, { transform: booleanAttribute });
  public readonly loading: BooleanInput = input<boolean, BooleanInputValue>(false, { transform: booleanAttribute });

  protected readonly elementRef: ElementRef<HTMLElement> = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly isNativeButton: boolean = this.elementRef.nativeElement.tagName.toLowerCase() === 'button';

  @HostListener('click', ['$event'])
  protected handleClick(event: Event): void {
    if (!this.disabled()) return;
    event.preventDefault();
    event.stopImmediatePropagation();
  }
}
