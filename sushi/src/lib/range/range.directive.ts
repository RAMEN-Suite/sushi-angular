import { afterRenderEffect, Directive, ElementRef, inject } from '@angular/core';
import { FORM_FIELD, FormField } from '@angular/forms/signals';
import { SelectionControlState } from '../form-control';

/** Styles a native range control and reflects its current progress. */
@Directive({
  selector: 'input[type="range"][suiRange]',
  host: {
    class: 'range sui-range',
    '[class.range-primary]': 'severity() === "primary"',
    '[class.range-secondary]': 'severity() === "secondary"',
    '[class.range-accent]': 'severity() === "accent"',
    '[class.range-neutral]': 'severity() === "neutral"',
    '[class.range-info]': 'severity() === "info"',
    '[class.range-success]': 'severity() === "success"',
    '[class.range-warning]': 'severity() === "warning"',
    '[class.range-error]': 'severity() === "error" || isInvalid()',
    '[class.range-xs]': 'size() === "xs"',
    '[class.range-sm]': 'size() === "sm"',
    '[class.range-md]': 'size() === "md"',
    '[class.range-lg]': 'size() === "lg"',
    '[class.range-xl]': 'size() === "xl"',
    '[attr.aria-invalid]': 'isInvalid() ? "true" : null',
    '(input)': 'updateProgress()',
  },
})
export class Range extends SelectionControlState {
  private readonly element: HTMLInputElement = inject<ElementRef<HTMLInputElement>>(ElementRef).nativeElement;
  private readonly formField: FormField<unknown> | null = inject(FORM_FIELD, { optional: true });

  public constructor() {
    super();
    afterRenderEffect({
      write: (): void => {
        const controlValue: unknown = this.formField?.state().controlValue();
        this.updateProgress(typeof controlValue === 'number' ? controlValue : undefined);
      },
    });
  }

  protected updateProgress(value: number = this.element.valueAsNumber): void {
    const min: number = Number(this.element.min || 0);
    const max: number = Number(this.element.max || 100);
    const progress: number = max === min ? 0 : ((value - min) / (max - min)) * 100;
    this.element.style.setProperty('--sui-range-progress', `${Math.min(100, Math.max(0, progress))}%`);
  }
}
