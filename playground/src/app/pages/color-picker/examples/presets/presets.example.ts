import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LucideCheck } from '@lucide/angular';
import { ColorPicker, ColorPickerPreset, ColorPickerPresetTemplate, Label } from '@sushi-kit/angular';

@Component({
  selector: 'pg-color-picker-presets-example',
  imports: [LucideCheck, ColorPicker, ColorPickerPresetTemplate, Label],
  templateUrl: './presets.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorPickerPresetsExample {
  protected readonly colors: readonly string[] = ['#991b1b', '#c2410c', '#ca8a04', '#15803d', '#0369a1', '#6d28d9'];
  protected readonly presets: readonly ColorPickerPreset[] = [
    { label: 'Ruby', value: '#991b1b' },
    { label: 'Ember', value: '#c2410c' },
    { label: 'Gold', value: '#ca8a04' },
    { label: 'Forest', value: '#15803d' },
    { label: 'Ocean', value: '#0369a1' },
    { label: 'Violet', value: '#6d28d9' },
    { label: 'Unavailable', value: '#94a3b8', disabled: true },
  ];
}
