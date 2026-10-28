import { Directive, ElementRef, inject, input, type InputSignal } from '@angular/core';

/** Marks one copyable line and optionally displays a prefix. */
@Directive({
  selector: '[suiCodeLine]',
  host: {
    '[attr.data-prefix]': 'prefix()',
  },
})
export class CodeLine {
  /** Displays a line number, prompt, or output marker. */
  public readonly prefix: InputSignal<string | number | null> = input<string | number | null>(null);

  private readonly element: ElementRef<HTMLElement> = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Returns the rendered line text used by the parent copy action. */
  public text(): string {
    return this.element.nativeElement.textContent.trimEnd();
  }
}
