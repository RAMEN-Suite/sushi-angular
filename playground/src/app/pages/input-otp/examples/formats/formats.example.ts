import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Card, InputOtp, Label } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-input-otp-formats-example',
  imports: [Card, InputOtp, Label],
  templateUrl: './formats.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputOtpFormatsExample {}
