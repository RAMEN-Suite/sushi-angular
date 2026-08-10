import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { email, FieldTree, form, FormField as SignalFormField, required } from '@angular/forms/signals';
import {
  Button,
  Card,
  CardTitle,
  Code,
  CodeLine,
  FormField,
  FormFieldError,
  FormFieldHint,
  FormFieldLabel,
  Input,
  InputNumber,
  Label,
  Textarea,
} from '@ramen-suite/sushi';

@Component({
  selector: 'pg-form-field-page',
  imports: [
    SignalFormField,
    Button,
    Card,
    CardTitle,
    Code,
    CodeLine,
    FormField,
    FormFieldError,
    FormFieldHint,
    FormFieldLabel,
    Input,
    InputNumber,
    Label,
    Textarea,
  ],
  templateUrl: './form-field.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormFieldPage {
  protected readonly model: WritableSignal<{ email: string }> = signal<{ email: string }>({ email: '' });
  protected readonly fieldForm: FieldTree<{ email: string }> = form(this.model, (schema) => {
    required(schema.email);
    email(schema.email);
  });

  protected reset(): void {
    this.fieldForm().reset({ email: '' });
  }
}
