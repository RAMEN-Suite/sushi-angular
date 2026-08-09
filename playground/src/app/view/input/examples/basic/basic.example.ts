import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { FieldTree, form, FormField, required, SchemaPathTree } from '@angular/forms/signals';
import { Button, Input, Join, JoinItem } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-input-basic-example',
  imports: [FormField, Button, Input, Join, JoinItem],
  templateUrl: './basic.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputBasicExample {
  protected readonly model: WritableSignal<{ name: string }> = signal({ name: '' });
  protected readonly form: FieldTree<{ name: string }> = form(this.model, (schema: SchemaPathTree<{ name: string }>): void =>
    required(schema.name),
  );

  protected reset(): void {
    this.form().reset({ name: '' });
  }
}
