import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Chip } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-chip-image-example',
  imports: [Chip],
  templateUrl: './image.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChipImageExample {}
