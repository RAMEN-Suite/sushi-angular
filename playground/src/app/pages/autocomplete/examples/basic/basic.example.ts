import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { FieldTree, form, FormField } from '@angular/forms/signals';
import { Autocomplete, AutocompleteOption, AutocompleteValue, Button, Join, JoinItem, Label } from '@sushi-kit/angular';

interface CityForm {
  city: AutocompleteValue;
}

@Component({
  selector: 'pg-autocomplete-basic-example',
  imports: [FormField, Autocomplete, Button, Join, JoinItem, Label],
  templateUrl: './basic.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutocompleteBasicExample {
  protected readonly cities: readonly AutocompleteOption[] = [
    { label: 'Amsterdam', value: 'amsterdam' },
    { label: 'Berlin', value: 'berlin' },
    { label: 'Lisbon', value: 'lisbon' },
    { label: 'Paris', value: 'paris' },
  ];
  protected readonly model: WritableSignal<CityForm> = signal<CityForm>({ city: null });
  protected readonly cityForm: FieldTree<CityForm> = form(this.model);

  protected reset(): void {
    this.cityForm().reset({ city: null });
  }
}
