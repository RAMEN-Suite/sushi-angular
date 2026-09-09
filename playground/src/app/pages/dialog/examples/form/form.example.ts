import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import {
  Button,
  Checkbox,
  Dialog,
  DialogClose,
  DialogCloseEvent,
  DialogBody,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  Fieldset,
  FieldsetLegend,
  Input,
  Label,
  Textarea,
} from '@ramen-suite/sushi';

@Component({
  selector: 'pg-dialog-form-example',
  imports: [
    Button,
    Checkbox,
    Dialog,
    DialogBody,
    DialogClose,
    DialogFooter,
    DialogHeader,
    DialogTrigger,
    Fieldset,
    FieldsetLegend,
    Input,
    Label,
    Textarea,
  ],
  templateUrl: './form.example.html',
  styleUrl: './form.example.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogFormExample {
  protected readonly open: WritableSignal<boolean> = signal<boolean>(false);
  protected readonly result: WritableSignal<string> = signal<string>('Not submitted');

  protected record(event: DialogCloseEvent): void {
    if (event.returnValue === 'reserve') this.result.set('Reservation saved');
  }
}
