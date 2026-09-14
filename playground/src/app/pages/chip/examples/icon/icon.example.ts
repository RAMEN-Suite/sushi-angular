import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LucideApple, LucideCode, LucideSparkles } from '@lucide/angular';
import { Chip } from '@sushi-kit/angular';

@Component({
  selector: 'pg-chip-icon-example',
  imports: [Chip, LucideApple, LucideCode, LucideSparkles],
  templateUrl: './icon.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChipIconExample {}
