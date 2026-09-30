import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { FieldTree, form, FormField, required, SchemaPathTree } from '@angular/forms/signals';
import { Input, Label } from '@sushi-kit/angular';

interface InputModel {
  name: string;
}

@Component({
  selector: 'pg-input-basic-example',
  imports: [FormField, Input, Label],
  templateUrl: './basic.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputBasicExample {
  protected readonly model: WritableSignal<InputModel> = signal({ name: '' });
  protected readonly form: FieldTree<InputModel> = form(this.model, (schema: SchemaPathTree<InputModel>): void =>
    required(schema.name),
  );
}
