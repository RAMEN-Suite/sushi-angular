import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge, Fieldset, FieldsetLegend, Textarea, TextareaSeverity, TextareaSize } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-textarea-appearance-example',
  imports: [Badge, Fieldset, FieldsetLegend, Textarea],
  templateUrl: './appearance.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextareaAppearanceExample {
  protected readonly sizes: readonly TextareaSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];
  protected readonly colors: readonly TextareaSeverity[] = [
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
