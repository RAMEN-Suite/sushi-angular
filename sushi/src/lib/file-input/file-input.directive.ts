import { Directive } from '@angular/core';
import { FluidControlState } from '../form-control';

@Directive({
  selector: 'input[type="file"][suiFileInput]',
  host: {
    class: 'file-input sui-file-input sui-form-control',

    '[class.file-input-primary]': 'severity() === "primary"',
    '[class.file-input-secondary]': 'severity() === "secondary"',
    '[class.file-input-accent]': 'severity() === "accent"',
    '[class.file-input-neutral]': 'severity() === "neutral"',
    '[class.file-input-info]': 'severity() === "info"',
    '[class.file-input-success]': 'severity() === "success"',
    '[class.file-input-warning]': 'severity() === "warning"',
    '[class.file-input-error]': 'severity() === "error" || isInvalid()',

    '[class.file-input-xs]': 'size() === "xs"',
    '[class.file-input-sm]': 'size() === "sm"',
    '[class.file-input-md]': 'size() === "md"',
    '[class.file-input-lg]': 'size() === "lg"',
    '[class.file-input-xl]': 'size() === "xl"',
    '[class.w-full]': 'fluid()',

    '[attr.aria-invalid]': 'isInvalid() ? "true" : null',
  },
})
export class FileInput extends FluidControlState {}
