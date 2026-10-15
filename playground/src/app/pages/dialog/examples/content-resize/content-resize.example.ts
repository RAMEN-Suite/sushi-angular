import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import {
  Button,
  Checkbox,
  Dialog,
  DialogBody,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  Input,
  Label,
} from '@sushi-kit/angular';

@Component({
  selector: 'pg-dialog-content-resize-example',
  imports: [Button, Checkbox, Dialog, DialogBody, DialogClose, DialogFooter, DialogHeader, DialogTrigger, Input, Label],
  templateUrl: './content-resize.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogContentResizeExample {
  protected readonly detailed: WritableSignal<boolean> = signal(false);
  protected readonly automatic: WritableSignal<boolean> = signal(true);
}
