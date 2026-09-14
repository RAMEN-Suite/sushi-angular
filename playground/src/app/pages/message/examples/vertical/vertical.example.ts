import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LucideMessageCircleQuestionMark } from '@lucide/angular';
import { Button, Message, MessageActions } from '@sushi-kit/angular';

@Component({
  selector: 'pg-message-vertical-example',
  imports: [Button, LucideMessageCircleQuestionMark, Message, MessageActions],
  templateUrl: './vertical.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageVerticalExample {}
