import { afterNextRender, DestroyRef, Directive, ElementRef, inject, input, InputSignal } from '@angular/core';
import { FormControlState } from '../form-control';
import { TextareaResize, TextareaSeverity, TextareaSize } from './textarea.interfaces';

@Directive({
  selector: 'textarea[suiTextarea]',
  host: {
    class: 'textarea sui-textarea sui-form-control',

    '[class.textarea-primary]': 'severity() === "primary"',
    '[class.textarea-secondary]': 'severity() === "secondary"',
    '[class.textarea-accent]': 'severity() === "accent"',
    '[class.textarea-neutral]': 'severity() === "neutral"',
    '[class.textarea-info]': 'severity() === "info"',
    '[class.textarea-success]': 'severity() === "success"',
    '[class.textarea-warning]': 'severity() === "warning"',
    '[class.textarea-error]': 'severity() === "error" || isInvalid()',

    '[class.textarea-xs]': 'size() === "xs"',
    '[class.textarea-sm]': 'size() === "sm"',
    '[class.textarea-md]': 'size() === "md"',
    '[class.textarea-lg]': 'size() === "lg"',
    '[class.textarea-xl]': 'size() === "xl"',

    '[class.resize-none]': 'resize() === "none"',
    '[class.resize-y]': 'resize() === "vertical"',
    '[class.resize-x]': 'resize() === "horizontal"',
    '[class.resize]': 'resize() === "both"',

    '[attr.aria-invalid]': 'isInvalid() ? "true" : null',
  },
})
export class Textarea extends FormControlState {
  /** Applies a semantic border color to the textarea. */
  public readonly severity: InputSignal<TextareaSeverity | null> = input<TextareaSeverity | null>(null);

  /** Sets the control height and text size. */
  public readonly size: InputSignal<TextareaSize> = input<TextareaSize>('md');

  /** Controls which directions the user may resize the textarea. */
  public readonly resize: InputSignal<TextareaResize> = input<TextareaResize>('vertical');

  private readonly element: ElementRef<HTMLTextAreaElement> = inject<ElementRef<HTMLTextAreaElement>>(ElementRef);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private observer: ResizeObserver | undefined;

  public constructor() {
    super();

    afterNextRender((): void => {
      const parent: HTMLElement | null = this.element.nativeElement.parentElement;
      if (!parent) return;

      this.observer = new ResizeObserver(([entry]: ResizeObserverEntry[]): void => {
        const inlineSize: number = entry.contentBoxSize[0]?.inlineSize ?? entry.contentRect.width;
        this.element.nativeElement.style.maxInlineSize = `${inlineSize}px`;
      });
      this.observer.observe(parent);
    });

    this.destroyRef.onDestroy((): void => this.observer?.disconnect());
  }
}
