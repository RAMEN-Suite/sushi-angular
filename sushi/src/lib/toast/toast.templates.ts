import { Directive, inject, input, type InputSignal, TemplateRef } from '@angular/core';
import { type ToastTemplateContext } from './toast.interfaces';

/** Registers named custom content that can be selected for individual Toasts. */
@Directive({ selector: 'ng-template[suiToastContent]' })
export class ToastContentTemplate {
  public static ngTemplateContextGuard(_directive: ToastContentTemplate, _context: unknown): _context is ToastTemplateContext {
    return true;
  }

  /** Name referenced by ToastOptions.template. */
  public readonly suiToastContent: InputSignal<string> = input.required<string>();

  /** @internal Template rendered by the owning Toast outlet. */
  public readonly template: TemplateRef<ToastTemplateContext> = inject<TemplateRef<ToastTemplateContext>>(TemplateRef);
}
