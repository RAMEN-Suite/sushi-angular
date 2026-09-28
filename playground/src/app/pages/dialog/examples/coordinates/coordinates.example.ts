import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { Button, Dialog, DialogBody, DialogHeader, DialogPosition, DialogTrigger } from '@sushi-kit/angular';

@Component({
  selector: 'pg-dialog-coordinates-example',
  imports: [Button, Dialog, DialogBody, DialogHeader, DialogTrigger],
  templateUrl: './coordinates.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogCoordinatesExample {
  protected readonly coordinates: WritableSignal<DialogPosition> = signal<DialogPosition>({ top: 80, right: '1.5rem' });
}
