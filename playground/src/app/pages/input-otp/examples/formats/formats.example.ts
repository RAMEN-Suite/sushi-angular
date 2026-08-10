import { ChangeDetectionStrategy, Component } from '@angular/core';
import { InputOtp } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-input-otp-formats-example',
  imports: [InputOtp],
  templateUrl: './formats.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputOtpFormatsExample {}
