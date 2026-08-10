import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { FieldTree, form, FormField } from '@angular/forms/signals';
import { Range } from '@ramen-suite/sushi';

interface MixerModel {
  music: number;
  voice: number;
}

@Component({
  selector: 'pg-range-mixer-example',
  imports: [FormField, Range],
  templateUrl: './mixer.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RangeMixerExample {
  protected readonly model: WritableSignal<MixerModel> = signal({ music: 70, voice: 85 });
  protected readonly form: FieldTree<MixerModel> = form(this.model);
}
