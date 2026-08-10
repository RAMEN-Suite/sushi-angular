import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { LucideMapPin } from '@lucide/angular';
import {
  Autocomplete,
  AutocompleteCompareWith,
  AutocompleteEmptyTemplate,
  AutocompleteFilter,
  AutocompleteItemTemplate,
  AutocompleteOption,
  AutocompletePrefixTemplate,
  AutocompleteValue,
  FormFieldLabel,
  Label,
} from '@ramen-suite/sushi';

interface DestinationValue {
  readonly id: string;
}

@Component({
  selector: 'pg-autocomplete-filtering-example',
  imports: [
    Autocomplete,
    AutocompleteEmptyTemplate,
    AutocompleteItemTemplate,
    AutocompletePrefixTemplate,
    FormFieldLabel,
    Label,
    LucideMapPin,
  ],
  templateUrl: './filtering.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutocompleteFilteringExample {
  protected readonly cities: readonly AutocompleteOption[] = [
    { label: 'Berlin', value: { id: 'berlin' } },
    { label: 'Barcelona', value: { id: 'barcelona' } },
    { label: 'Copenhagen', value: { id: 'copenhagen' } },
    { label: 'Lisbon', value: { id: 'lisbon' } },
    { label: 'London', value: { id: 'london' } },
  ];
  protected readonly value: WritableSignal<AutocompleteValue> = signal<AutocompleteValue>({ id: 'lisbon' });
  protected readonly startsWith: AutocompleteFilter = (option: AutocompleteOption, query: string): boolean =>
    option.label.toLocaleLowerCase().startsWith(query.trim().toLocaleLowerCase());
  protected readonly compareDestinations: AutocompleteCompareWith = (
    first: AutocompleteValue,
    second: AutocompleteValue,
  ): boolean => this.isDestination(first) && this.isDestination(second) && first.id === second.id;

  private isDestination(value: AutocompleteValue): value is DestinationValue {
    return typeof value === 'object' && value !== null && 'id' in value;
  }
}
