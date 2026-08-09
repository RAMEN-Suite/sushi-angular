import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge, Fieldset, FieldsetLegend, Input, InputSeverity, InputSize } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-input-appearance-example',
  imports: [Badge, Fieldset, FieldsetLegend, Input],
  templateUrl: './appearance.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputAppearanceExample {
  protected readonly sizes: readonly InputSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];
  protected readonly colors: readonly InputSeverity[] = ['primary', 'secondary', 'accent', 'neutral', 'info', 'success', 'warning', 'error'];
}
