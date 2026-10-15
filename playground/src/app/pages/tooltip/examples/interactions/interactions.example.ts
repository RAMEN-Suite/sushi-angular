import { ChangeDetectionStrategy, Component, signal, type WritableSignal } from '@angular/core';
import {
  Button,
  Dialog,
  DialogBody,
  DialogClose,
  DialogTrigger,
  Menu,
  MenuTrigger,
  Popover,
  PopoverTrigger,
  Tooltip,
} from '@sushi-kit/angular';

@Component({
  selector: 'pg-tooltip-interactions-example',
  imports: [Button, Dialog, DialogBody, DialogClose, DialogTrigger, Menu, MenuTrigger, Popover, PopoverTrigger, Tooltip],
  templateUrl: './interactions.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TooltipInteractionsExample {
  protected readonly exporting: WritableSignal<boolean> = signal(false);
  protected readonly result: WritableSignal<string> = signal('No export started.');

  protected finishExport(trigger: HTMLButtonElement, result: string): void {
    this.exporting.set(false);
    this.result.set(result);
    trigger.focus({ preventScroll: true });
  }
}
