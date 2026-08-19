import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LucideCloudOff, LucideSparkles } from '@lucide/angular';
import { Button, Message, MessageActions } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-message-actions-example',
  imports: [Button, LucideCloudOff, LucideSparkles, Message, MessageActions],
  templateUrl: './actions.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageActionsExample {}
