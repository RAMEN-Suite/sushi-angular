import { ChangeDetectionStrategy, Component } from '@angular/core';
import { InputOtp, Label } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-input-otp-states-example',
  imports: [InputOtp, Label],
  templateUrl: './states.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputOtpStatesExample {}
