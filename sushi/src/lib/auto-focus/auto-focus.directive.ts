import { afterNextRender, booleanAttribute, Directive, ElementRef, inject, input, InputSignalWithTransform } from '@angular/core';

@Directive({
  selector: '[suiAutoFocus]',
})
/** Moves focus to an enabled element after its first render. */
export class AutoFocus {
  /** Enables or suppresses the initial focus request. */
  public readonly enabled: InputSignalWithTransform<boolean, unknown> = input<boolean, unknown>(true, {
    alias: 'suiAutoFocus',
    transform: booleanAttribute,
  });

  private readonly elementRef: ElementRef<HTMLElement> = inject<ElementRef<HTMLElement>>(ElementRef);

  public constructor() {
    afterNextRender((): void => {
      if (!this.enabled()) return;

      const element: HTMLElement = this.elementRef.nativeElement;
      if (element.matches(':disabled, [aria-disabled="true"]')) return;

      element.focus();
    });
  }
}
