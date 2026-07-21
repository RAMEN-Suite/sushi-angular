import { afterNextRender, booleanAttribute, Directive, ElementRef, inject, input } from '@angular/core';
import { BooleanInput, BooleanInputValue } from '../sushi.types';

@Directive({
  selector: '[suiAutoFocus]',
  standalone: true,
})
export class AutoFocus {
  public readonly enabled: BooleanInput = input<boolean, BooleanInputValue>(true, {
    alias: 'suiAutoFocus',
    transform: booleanAttribute,
  });

  private readonly elementRef: ElementRef<HTMLElement> = inject<ElementRef<HTMLElement>>(ElementRef);

  public constructor() {
    afterNextRender((): void => {
      if (!this.enabled()) return;

      const element: HTMLElement = this.elementRef.nativeElement;
      if (element.matches(':disabled')) return;
      element.focus({ preventScroll: true });
    });
  }
}
