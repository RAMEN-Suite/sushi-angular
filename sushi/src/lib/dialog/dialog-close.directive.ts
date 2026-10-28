import { Directive, input, type InputSignal } from '@angular/core';
import { type Dialog } from './dialog.component';

/** Closes a Dialog from a native button. */
@Directive({
  selector: 'button[suiDialogClose]',
  host: { type: 'button', '(click)': 'dialog().close(suiDialogCloseValue(), "close")' },
})
export class DialogClose {
  /** Dialog closed by this action. */
  public readonly dialog: InputSignal<Dialog> = input.required<Dialog>({ alias: 'suiDialogClose' });
  /** Value returned with the native close event. */
  public readonly suiDialogCloseValue: InputSignal<string> = input<string>('');
}
