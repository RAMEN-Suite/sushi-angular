import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Chip } from '@sushi-kit/angular';

@Component({
  selector: 'pg-chip-appearance-example',
  imports: [Chip],
  templateUrl: './appearance.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChipAppearanceExample {}
