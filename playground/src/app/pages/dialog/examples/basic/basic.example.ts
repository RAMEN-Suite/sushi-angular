import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Button, Dialog, DialogBody, DialogHeader, DialogTrigger } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-dialog-basic-example',
  imports: [Button, Dialog, DialogBody, DialogHeader, DialogTrigger],
  templateUrl: './basic.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogBasicExample {}
