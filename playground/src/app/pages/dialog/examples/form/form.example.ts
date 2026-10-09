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
  Select,
  SelectModelValue,
  SelectOption,
  Textarea,
} from '@sushi-kit/angular';

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
    Select,
    Textarea,
  ],
  templateUrl: './form.example.html',
  styleUrl: './form.example.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogFormExample {
  protected readonly open: WritableSignal<boolean> = signal<boolean>(false);
  protected readonly result: WritableSignal<string> = signal<string>('Not submitted');
  protected readonly language: WritableSignal<SelectModelValue> = signal<SelectModelValue>('en');
  protected readonly languages: readonly SelectOption[] = [
    { label: 'English', value: 'en' },
    { label: 'Deutsch', value: 'de' },
    { label: 'Français', value: 'fr' },
  ];

  protected record(event: DialogCloseEvent): void {
    if (event.returnValue === 'reserve') this.result.set('Reservation saved');
  }
}
