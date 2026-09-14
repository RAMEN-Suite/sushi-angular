import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ColorPicker, Label } from '@sushi-kit/angular';

@Component({
  selector: 'pg-color-picker-states-example',
  imports: [ColorPicker, Label],
  templateUrl: './states.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorPickerStatesExample {}
