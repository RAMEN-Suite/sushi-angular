import { ChangeDetectionStrategy, Component, computed, Signal, signal, WritableSignal } from '@angular/core';
import { FieldTree, form, FormField } from '@angular/forms/signals';
import { Badge, Label, Listbox, ListboxModelValue, ListboxOption } from '@ramen-suite/sushi';

interface ChannelForm {
  channels: ListboxModelValue;
}

@Component({
  selector: 'pg-listbox-multiple-example',
  imports: [Badge, FormField, Label, Listbox],
  templateUrl: './multiple.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListboxMultipleExample {
  protected readonly channels: readonly ListboxOption[] = [
    { label: 'Product updates', value: 'product' },
    { label: 'Security alerts', value: 'security' },
    { label: 'Weekly summary', value: 'summary' },
    { label: 'Research invitations', value: 'research' },
  ];
  protected readonly model: WritableSignal<ChannelForm> = signal<ChannelForm>({ channels: ['product', 'security'] });
  protected readonly channelForm: FieldTree<ChannelForm> = form(this.model);
  protected readonly selectionCount: Signal<number> = computed((): number => {
    const value: ListboxModelValue = this.channelForm.channels().value();
    return Array.isArray(value) ? value.length : Number(value !== null);
  });
}
