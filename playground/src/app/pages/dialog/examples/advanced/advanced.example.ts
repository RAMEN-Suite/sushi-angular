import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Button, Dialog, DialogBody, DialogHeader, DialogTrigger } from '@sushi-kit/angular';

@Component({
  selector: 'pg-dialog-advanced-example',
  imports: [Button, Dialog, DialogBody, DialogHeader, DialogTrigger],
  templateUrl: './advanced.example.html',
  styleUrl: './advanced.example.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogAdvancedExample {}
