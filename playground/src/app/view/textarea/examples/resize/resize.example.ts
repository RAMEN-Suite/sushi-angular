import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge, Fieldset, FieldsetLegend, Textarea, TextareaResize } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-textarea-resize-example',
  imports: [Badge, Fieldset, FieldsetLegend, Textarea],
  templateUrl: './resize.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextareaResizeExample {
  protected readonly modes: readonly TextareaResize[] = ['none', 'vertical', 'horizontal', 'both'];
}
