import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Button, Dialog, DialogBody, DialogHeader, DialogTrigger } from '@sushi-kit/angular';

@Component({
  selector: 'pg-dialog-basic-example',
  imports: [Button, Dialog, DialogBody, DialogHeader, DialogTrigger],
  templateUrl: './basic.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogBasicExample {}
