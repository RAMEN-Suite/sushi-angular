import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Chip } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-chip-appearance-example',
  imports: [Chip],
  templateUrl: './appearance.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChipAppearanceExample {}
