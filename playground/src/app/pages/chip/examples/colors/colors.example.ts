import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Chip } from '@sushi-kit/angular';

@Component({
  selector: 'pg-chip-colors-example',
  imports: [Chip],
  templateUrl: './colors.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChipColorsExample {}
