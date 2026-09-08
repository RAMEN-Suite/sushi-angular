import { Directive } from '@angular/core';
import { ColorPickerPresetContext } from './color-picker.interfaces';

/** Replaces each preset action's default swatch while preserving selection, keyboard behavior, and themed interaction states. */
@Directive({ selector: 'ng-template[suiColorPickerPreset]' })
export class ColorPickerPresetTemplate {
  public static ngTemplateContextGuard(
    _directive: ColorPickerPresetTemplate,
    _context: unknown,
  ): _context is ColorPickerPresetContext {
    return true;
  }
}
