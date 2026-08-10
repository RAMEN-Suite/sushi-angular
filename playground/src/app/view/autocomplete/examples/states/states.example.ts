import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Autocomplete, AutocompleteOption, Badge, ComponentSize, Fieldset, FieldsetLegend } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-autocomplete-states-example',
  imports: [Autocomplete, Badge, Fieldset, FieldsetLegend],
  templateUrl: './states.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutocompleteStatesExample {
  protected readonly sizes: readonly ComponentSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];
  protected readonly options: readonly AutocompleteOption[] = [
    { label: 'Berlin', value: 'berlin' },
    { label: 'Lisbon', value: 'lisbon' },
    { label: 'Tokyo', value: 'tokyo' },
  ];
}
