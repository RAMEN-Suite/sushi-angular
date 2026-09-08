import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { Button, Dialog, DialogClose, DialogCloseEvent, Input, Label } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-dialog-controlled-example',
  imports: [Button, Dialog, DialogClose, Input, Label],
  templateUrl: './controlled.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogControlledExample {
  protected readonly open: WritableSignal<boolean> = signal<boolean>(false);
  protected readonly result: WritableSignal<string> = signal<string>('none');

  protected record(event: DialogCloseEvent): void {
    this.result.set(event.returnValue || event.reason);
  }
}
