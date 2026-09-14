import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge, Fieldset, FieldsetLegend, FileInput, FileInputSeverity, FileInputSize, Label } from '@sushi-kit/angular';

@Component({
  selector: 'pg-file-input-options-example',
  imports: [Badge, Fieldset, FieldsetLegend, FileInput, Label],
  templateUrl: './options.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileInputOptionsExample {
  protected readonly sizes: readonly FileInputSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];
  protected readonly colors: readonly FileInputSeverity[] = [
    'primary',
    'secondary',
    'accent',
    'neutral',
    'info',
    'success',
    'warning',
    'error',
  ];
}
