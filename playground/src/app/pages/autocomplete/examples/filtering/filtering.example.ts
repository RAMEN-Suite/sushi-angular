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
  Label,
} from '@sushi-kit/angular';

interface DestinationValue {
  readonly id: string;
}

interface DestinationOption extends AutocompleteOption {
  readonly country: string;
}

@Component({
  selector: 'pg-autocomplete-filtering-example',
  imports: [Autocomplete, AutocompleteEmptyTemplate, AutocompleteItemTemplate, AutocompletePrefixTemplate, Label, LucideMapPin],
  templateUrl: './filtering.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutocompleteFilteringExample {
  protected readonly cities: readonly DestinationOption[] = [
    { label: 'Berlin', value: { id: 'berlin' }, country: 'Germany' },
    { label: 'Barcelona', value: { id: 'barcelona' }, country: 'Spain' },
    { label: 'Copenhagen', value: { id: 'copenhagen' }, country: 'Denmark' },
    { label: 'Lisbon', value: { id: 'lisbon' }, country: 'Portugal' },
    { label: 'London', value: { id: 'london' }, country: 'United Kingdom' },
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
