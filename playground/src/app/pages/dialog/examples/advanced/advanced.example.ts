import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Button, Dialog, DialogBody, DialogHeader, DialogTrigger } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-dialog-advanced-example',
  imports: [Button, Dialog, DialogBody, DialogHeader, DialogTrigger],
  templateUrl: './advanced.example.html',
  styleUrl: './advanced.example.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogAdvancedExample {}
