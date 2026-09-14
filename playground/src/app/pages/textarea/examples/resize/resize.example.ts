import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge, Fieldset, FieldsetLegend, Label, Textarea, TextareaResize } from '@sushi-kit/angular';

@Component({
  selector: 'pg-textarea-resize-example',
  imports: [Badge, Fieldset, FieldsetLegend, Label, Textarea],
  templateUrl: './resize.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextareaResizeExample {
  protected readonly modes: readonly TextareaResize[] = ['none', 'vertical', 'horizontal', 'both'];
}
