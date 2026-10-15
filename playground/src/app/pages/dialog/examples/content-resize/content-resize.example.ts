import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import {
  Button,
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
  imports: [Button, Dialog, DialogBody, DialogClose, DialogFooter, DialogHeader, DialogTrigger, Input, Label],
  templateUrl: './content-resize.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogContentResizeExample {
  protected readonly detailed: WritableSignal<boolean> = signal(false);
}
