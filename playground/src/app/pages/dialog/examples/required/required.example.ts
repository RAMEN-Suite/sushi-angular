import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Button, Dialog, DialogClose, DialogTrigger } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-dialog-required-example',
  imports: [Button, Dialog, DialogClose, DialogTrigger],
  templateUrl: './required.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogRequiredExample {}
