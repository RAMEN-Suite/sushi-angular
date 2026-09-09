import { Directive, inject, input, InputSignal, TemplateRef } from '@angular/core';
import { ToastTemplateContext } from './toast.interfaces';

@Directive({ selector: 'ng-template[suiToastContent]' })
/** Registers named custom content that can be selected for individual Toasts. */
export class ToastContentTemplate {
  public static ngTemplateContextGuard(_directive: ToastContentTemplate, _context: unknown): _context is ToastTemplateContext {
    return true;
  }

  /** Name referenced by ToastOptions.template. */
  public readonly suiToastContent: InputSignal<string> = input.required<string>();

  /** @internal Template rendered by the owning Toast outlet. */
  public readonly template: TemplateRef<ToastTemplateContext> = inject<TemplateRef<ToastTemplateContext>>(TemplateRef);
}
