import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { FieldTree, form, FormField } from '@angular/forms/signals';
import { Button, ColorPicker, JoinItem, Label } from '@sushi-kit/angular';

interface ColorModel {
  color: string;
}

const DEFAULT_COLOR: string = '#0369a1';

@Component({
  selector: 'pg-color-picker-basic-example',
  imports: [FormField, Button, ColorPicker, JoinItem, Label],
  templateUrl: './basic.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorPickerBasicExample {
  protected readonly model: WritableSignal<ColorModel> = signal({ color: DEFAULT_COLOR });
  protected readonly form: FieldTree<ColorModel> = form(this.model);

  protected reset(): void {
    this.form().reset({ color: DEFAULT_COLOR });
  }
}
