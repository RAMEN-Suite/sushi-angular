import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LucideCircleX, LucidePalette } from '@lucide/angular';
import { Chip, ChipContentTemplate, ChipRemoveIconTemplate } from '@sushi-kit/angular';

@Component({
  selector: 'pg-chip-template-example',
  imports: [Chip, ChipContentTemplate, ChipRemoveIconTemplate, LucideCircleX, LucidePalette],
  templateUrl: './template.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChipTemplateExample {}
