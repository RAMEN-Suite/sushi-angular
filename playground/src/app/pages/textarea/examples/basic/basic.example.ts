import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { FieldTree, form, FormField, maxLength, required, SchemaPathTree } from '@angular/forms/signals';
import { Button, Join, JoinItem, Label, Textarea } from '@ramen-suite/sushi';

interface TextareaModel {
  message: string;
}

@Component({
  selector: 'pg-textarea-basic-example',
  imports: [FormField, Button, Join, JoinItem, Label, Textarea],
  templateUrl: './basic.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextareaBasicExample {
  protected readonly model: WritableSignal<TextareaModel> = signal({ message: '' });
  protected readonly form: FieldTree<TextareaModel> = form(this.model, (schema: SchemaPathTree<TextareaModel>): void => {
    required(schema.message);
    maxLength(schema.message, 240);
  });

  protected reset(): void {
    this.form().reset({ message: '' });
  }
}
