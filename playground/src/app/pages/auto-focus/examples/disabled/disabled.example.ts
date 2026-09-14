import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AutoFocus, Input } from '@sushi-kit/angular';

@Component({
  selector: 'pg-auto-focus-disabled-example',
  imports: [AutoFocus, Input],
  templateUrl: './disabled.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutoFocusDisabledExample {}
