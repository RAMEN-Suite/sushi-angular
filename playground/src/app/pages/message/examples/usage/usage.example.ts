import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LucideCircleCheck, LucideCircleX, LucideInfo, LucideTriangleExclamationPoint } from '@lucide/angular';
import { Message } from '@sushi-kit/angular';

@Component({
  selector: 'pg-message-usage-example',
  imports: [LucideCircleCheck, LucideCircleX, LucideInfo, LucideTriangleExclamationPoint, Message],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageUsageExample {}
