import { booleanAttribute, Directive, ElementRef, HostListener, inject, input, InputSignal } from '@angular/core';
import { SuiBooleanAttribute, SuiBooleanInput } from '../sushi.types';
import { SuiButtonSeverity, SuiButtonShape, SuiButtonSize, SuiButtonVariant } from './button.interfaces';

@Directive({
  selector: 'button[suiButton], a[suiButton]',
  standalone: true,
  host: {
    class: 'btn sui-button-control',

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

    '[attr.aria-busy]': 'loading() ? "true": null',
    '[attr.aria-disabled]': 'disabled() ? "true" : null',
    '[attr.disabled]': 'disabled() && isNativeButton ? "" : null',
    '[attr.tabindex]': 'disabled() && !isNativeButton ? -1 : null',
  },
})
export class SuiButton {
  protected readonly elementRef: ElementRef<HTMLElement> = inject<ElementRef<HTMLElement>>(ElementRef<HTMLElement>);
  protected readonly isNativeButton: boolean = this.elementRef.nativeElement.tagName.toLowerCase() === 'button';

  public readonly severity: InputSignal<SuiButtonSeverity> = input<SuiButtonSeverity>('primary');
  public readonly variant: InputSignal<SuiButtonVariant | null> = input<SuiButtonVariant | null>(null);
  public readonly size: InputSignal<SuiButtonSize> = input<SuiButtonSize>('md');
  public readonly shape: InputSignal<SuiButtonShape> = input<SuiButtonShape>('default');

  public readonly disabled: SuiBooleanInput = input<boolean, SuiBooleanAttribute>(false, { transform: booleanAttribute });
  public readonly loading: SuiBooleanInput = input<boolean, SuiBooleanAttribute>(false, { transform: booleanAttribute });

  @HostListener('click', ['$event'])
  protected onClick(event: Event): void {
    if (!this.disabled()) return;
    event.preventDefault();
    event.stopImmediatePropagation();
  }
}
