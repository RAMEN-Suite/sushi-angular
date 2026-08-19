import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LucideCircleCheck, LucideCircleX, LucideInfo, LucideTriangleAlert } from '@lucide/angular';
import { Message } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-message-usage-example',
  imports: [LucideCircleCheck, LucideCircleX, LucideInfo, LucideTriangleAlert, Message],
  templateUrl: './usage.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageUsageExample {}
