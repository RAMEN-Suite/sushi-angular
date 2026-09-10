import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LucideInfo } from '@lucide/angular';
import { Button, Popover } from '@ramen-suite/sushi';
@Component({
  selector: 'pg-popover-target-example',
  imports: [Button, LucideInfo, Popover],
  templateUrl: './target.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopoverTargetExample {}
