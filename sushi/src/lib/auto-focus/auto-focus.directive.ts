import { afterNextRender, booleanAttribute, Directive, ElementRef, inject, input, InputSignalWithTransform } from '@angular/core';

@Directive({
  selector: '[suiAutoFocus]',
})
export class AutoFocus {
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
