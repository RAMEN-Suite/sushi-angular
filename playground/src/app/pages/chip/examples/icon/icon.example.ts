import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LucideApple, LucideCode, LucideSparkles } from '@lucide/angular';
import { Chip } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-chip-icon-example',
  imports: [Chip, LucideApple, LucideCode, LucideSparkles],
  templateUrl: './icon.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChipIconExample {}
