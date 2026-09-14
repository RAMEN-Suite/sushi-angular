import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Autocomplete, AutocompleteOption, Badge, ComponentSize, Fieldset, FieldsetLegend, Label } from '@sushi-kit/angular';

@Component({
  selector: 'pg-autocomplete-states-example',
  imports: [Autocomplete, Badge, Fieldset, FieldsetLegend, Label],
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
