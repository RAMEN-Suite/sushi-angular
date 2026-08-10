import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { FieldTree, form, FormField } from '@angular/forms/signals';
import { Button, InputOtp } from '@ramen-suite/sushi';

interface OtpModel {
  code: string;
}

@Component({
  selector: 'pg-input-otp-basic-example',
  imports: [FormField, Button, InputOtp],
  templateUrl: './basic.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputOtpBasicExample {
  protected readonly model: WritableSignal<OtpModel> = signal({ code: '' });
  protected readonly form: FieldTree<OtpModel> = form(this.model);

  protected reset(): void {
    this.form().reset({ code: '' });
  }
}
