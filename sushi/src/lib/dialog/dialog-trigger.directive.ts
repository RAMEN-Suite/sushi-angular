import {
  booleanAttribute,
  computed,
  Directive,
  ElementRef,
  inject,
  input,
  type InputSignal,
  type InputSignalWithTransform,
  type Signal,
} from '@angular/core';
import { type Dialog } from './dialog.component';
import { OVERLAY_TRIGGER_OPEN } from '../internal/overlay-trigger-state';

@Directive({
  selector: 'button[suiDialogTrigger]',
  providers: [
    {
      provide: OVERLAY_TRIGGER_OPEN,
      useFactory: (): Signal<boolean> => {
        const trigger: DialogTrigger = inject(DialogTrigger);
        return computed((): boolean => trigger.dialog().open());
      },
    },
  ],
  host: {
    type: 'button',
    '[attr.aria-controls]': 'dialog().dialogId',
    '[attr.aria-expanded]': 'dialog().open()',
    '[attr.aria-haspopup]': '"dialog"',
    '[attr.aria-disabled]': 'disabled() || null',
    '[attr.disabled]': 'null',
    '(click)': 'handleClick($event)',
  },
})
/** Opens and closes a Dialog from a native button. */
export class DialogTrigger {
  /** Dialog controlled by this trigger. */
  public readonly dialog: InputSignal<Dialog> = input.required<Dialog>({ alias: 'suiDialogTrigger' });
  /** Prevents activation while keeping the trigger focusable. */
  public readonly disabled: InputSignalWithTransform<boolean, unknown> = input(false, { transform: booleanAttribute });

  private readonly element: ElementRef<HTMLButtonElement> = inject<ElementRef<HTMLButtonElement>>(ElementRef);

  protected handleClick(event: MouseEvent): void {
    if (this.disabled()) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    this.dialog().toggle(this.element.nativeElement);
  }
}
