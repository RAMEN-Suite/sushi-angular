import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge, Fieldset, FieldsetLegend, InputOtp } from '@ramen-suite/sushi';

type ControlSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'pg-input-otp-sizes-example',
  imports: [Badge, Fieldset, FieldsetLegend, InputOtp],
  templateUrl: './sizes.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputOtpSizesExample {
  protected readonly sizes: readonly ControlSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];
}
