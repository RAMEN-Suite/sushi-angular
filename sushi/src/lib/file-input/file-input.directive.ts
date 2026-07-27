import { computed, Directive, input, InputSignal, Signal } from '@angular/core';
import { FormControlState } from '../form-control/form-control-state';
import { FileInputSeverity, FileInputSize, FileInputVariant } from './file-input.interfaces';

@Directive({
  selector: 'input[type="file"][suiFileInput]',
  host: {
    class: 'file-input sui-file-input sui-form-control',

    '[class.file-input-primary]': 'computedSeverity() === "primary"',
    '[class.file-input-secondary]': 'computedSeverity() === "secondary"',
    '[class.file-input-accent]': 'computedSeverity() === "accent"',
    '[class.file-input-neutral]': 'computedSeverity() === "neutral"',
    '[class.file-input-info]': 'computedSeverity() === "info"',
    '[class.file-input-success]': 'computedSeverity() === "success"',
    '[class.file-input-warning]': 'computedSeverity() === "warning"',
    '[class.file-input-error]': 'computedSeverity() === "error"',

    '[class.file-input-ghost]': 'variant() === "ghost"',

    '[class.file-input-xs]': 'size() === "xs"',
    '[class.file-input-sm]': 'size() === "sm"',
    '[class.file-input-md]': 'size() === "md"',
    '[class.file-input-lg]': 'size() === "lg"',
    '[class.file-input-xl]': 'size() === "xl"',

    '[attr.aria-invalid]': 'isInvalid() ? "true" : null',
  },
})
export class FileInput extends FormControlState {
  public readonly severity: InputSignal<FileInputSeverity | null> = input<FileInputSeverity | null>(null);
  public readonly size: InputSignal<FileInputSize> = input<FileInputSize>('md');
  public readonly variant: InputSignal<FileInputVariant | null> = input<FileInputVariant | null>(null);

  protected readonly computedSeverity: Signal<FileInputSeverity | null> = computed<FileInputSeverity | null>((): FileInputSeverity | null => {
    return this.isInvalid() ? 'error' : this.severity();
  });
}
