import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { FieldTree, form, FormField, max, min, SchemaPathTree } from '@angular/forms/signals';
import { Button, Range } from '@ramen-suite/sushi';

interface VolumeModel {
  volume: number;
}

@Component({
  selector: 'pg-range-basic-example',
  imports: [FormField, Button, Range],
  templateUrl: './basic.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RangeBasicExample {
  protected readonly model: WritableSignal<VolumeModel> = signal({ volume: 40 });
  protected readonly form: FieldTree<VolumeModel> = form(this.model, (schema: SchemaPathTree<VolumeModel>): void => {
    min(schema.volume, 0);
    max(schema.volume, 100);
  });

  protected reset(): void {
    this.form().reset({ volume: 40 });
  }
}
