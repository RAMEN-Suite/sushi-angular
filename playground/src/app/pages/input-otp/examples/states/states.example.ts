import { ChangeDetectionStrategy, Component } from '@angular/core';
import { InputOtp } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-input-otp-states-example',
  imports: [InputOtp],
  templateUrl: './states.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputOtpStatesExample {}
