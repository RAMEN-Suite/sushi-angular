import { Directive, input, InputSignal } from '@angular/core';
import { Dialog } from './dialog.directive';

@Directive({
  selector: 'button[suiDialogClose]',
  host: { type: 'button', '(click)': 'dialog().close(suiDialogCloseValue(), "close")' },
})
/** Closes a Dialog from a native button. */
export class DialogClose {
  /** Dialog closed by this action. */
  public readonly dialog: InputSignal<Dialog> = input.required<Dialog>({ alias: 'suiDialogClose' });
  /** Value returned with the native close event. */
  public readonly suiDialogCloseValue: InputSignal<string> = input<string>('');
}
