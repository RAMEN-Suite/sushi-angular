import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Card, Label, Listbox, ListboxEmptyTemplate, ListboxOption } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-listbox-states-example',
  imports: [Card, Label, Listbox, ListboxEmptyTemplate],
  templateUrl: './states.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListboxStatesExample {
  protected readonly options: readonly ListboxOption[] = [
    { label: 'Draft', value: 'draft' },
    { label: 'In review', value: 'review' },
    { label: 'Published', value: 'published' },
    { label: 'Archived', value: 'archived' },
    { label: 'Scheduled', value: 'scheduled' },
  ];
  protected readonly noOptions: readonly ListboxOption[] = [];
}
