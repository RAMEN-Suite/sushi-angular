import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ColorPicker } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-color-picker-states-example',
  imports: [ColorPicker],
  templateUrl: './states.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorPickerStatesExample {}
