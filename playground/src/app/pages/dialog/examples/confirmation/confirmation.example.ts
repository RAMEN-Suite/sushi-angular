import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Button, Card, CardActions, CardTitle, Dialog, DialogClose, DialogTrigger } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-dialog-confirmation-example',
  imports: [Button, Card, CardActions, CardTitle, Dialog, DialogClose, DialogTrigger],
  templateUrl: './confirmation.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogConfirmationExample {}
