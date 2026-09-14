import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge, Fieldset, FieldsetLegend, Label, Textarea, TextareaSeverity, TextareaSize } from '@sushi-kit/angular';

@Component({
  selector: 'pg-textarea-appearance-example',
  imports: [Badge, Fieldset, FieldsetLegend, Label, Textarea],
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
