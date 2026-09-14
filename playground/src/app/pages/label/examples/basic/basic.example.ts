import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Input, Label, Select, SelectOption, Textarea } from '@sushi-kit/angular';

@Component({
  selector: 'pg-label-basic-example',
  imports: [Input, Label, Select, Textarea],
  templateUrl: './basic.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LabelBasicExample {
  protected readonly priorities: readonly SelectOption[] = [
    { label: 'Low', value: 'low' },
    { label: 'Normal', value: 'normal' },
    { label: 'High', value: 'high' },
  ];
}
