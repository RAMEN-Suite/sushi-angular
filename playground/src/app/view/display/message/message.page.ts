import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Button, Card, CardTitle, Code, CodeLine, Message, MessageActions } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-message-page',
  imports: [Button, Card, CardTitle, Code, CodeLine, Message, MessageActions],
  templateUrl: './message.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagePage {}
