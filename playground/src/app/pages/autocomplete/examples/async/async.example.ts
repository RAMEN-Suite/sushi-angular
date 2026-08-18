import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal, WritableSignal } from '@angular/core';
import {
  Autocomplete,
  AutocompleteEmptyTemplate,
  AutocompleteErrorTemplate,
  AutocompleteLoadingTemplate,
  AutocompleteOption,
  Label,
  Spinner,
} from '@ramen-suite/sushi';

@Component({
  selector: 'pg-autocomplete-async-example',
  imports: [Autocomplete, AutocompleteEmptyTemplate, AutocompleteErrorTemplate, AutocompleteLoadingTemplate, Label, Spinner],
  templateUrl: './async.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutocompleteAsyncExample {
  private readonly cities: readonly AutocompleteOption[] = [
    { label: 'Amsterdam', value: 'amsterdam' },
    { label: 'Berlin', value: 'berlin' },
    { label: 'Copenhagen', value: 'copenhagen' },
    { label: 'Lisbon', value: 'lisbon' },
  ];

  protected readonly options: WritableSignal<readonly AutocompleteOption[]> = signal([]);
  protected readonly loading: WritableSignal<boolean> = signal(false);
  protected readonly error: WritableSignal<string | null> = signal(null);

  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private timer: ReturnType<typeof setTimeout> | undefined;

  public constructor() {
    this.destroyRef.onDestroy(() => clearTimeout(this.timer));
  }

  protected search(query: string): void {
    clearTimeout(this.timer);
    this.error.set(null);
    if (query.length < 2) {
      this.options.set([]);
      this.loading.set(false);
      return;
    }
    this.loading.set(true);
    this.timer = setTimeout(() => {
      this.options.set(
        this.cities.filter((city: AutocompleteOption): boolean => city.label.toLowerCase().includes(query.toLowerCase())),
      );
      this.loading.set(false);
    }, 300);
  }
}
