import { Directive } from '@angular/core';
import { ColorPickerPresetContext } from './color-picker.interfaces';

/** Replaces the content of each preset color action. */
@Directive({ selector: 'ng-template[suiColorPickerPreset]' })
export class ColorPickerPresetTemplate {
  public static ngTemplateContextGuard(
    _directive: ColorPickerPresetTemplate,
    _context: unknown,
  ): _context is ColorPickerPresetContext {
    return true;
  }
}
