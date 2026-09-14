import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { FieldTree, form, FormField, required, SchemaPathTree } from '@angular/forms/signals';
import { Button, Input, Join, JoinItem, Label } from '@sushi-kit/angular';

interface InputModel {
  name: string;
}

@Component({
  selector: 'pg-input-basic-example',
  imports: [FormField, Button, Input, Join, JoinItem, Label],
  templateUrl: './basic.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputBasicExample {
  protected readonly model: WritableSignal<InputModel> = signal({ name: '' });
  protected readonly form: FieldTree<InputModel> = form(this.model, (schema: SchemaPathTree<InputModel>): void =>
    required(schema.name),
  );

  protected reset(): void {
    this.form().reset({ name: '' });
  }
}
