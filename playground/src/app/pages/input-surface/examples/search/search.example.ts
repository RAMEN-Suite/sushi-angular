import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { FieldTree, form, FormField } from '@angular/forms/signals';
import { LucideSearch } from '@lucide/angular';
import { Button, InputSurface, InputSurfaceControl, Join, JoinItem, Kbd, Label } from '@sushi-kit/angular';

interface SearchModel {
  query: string;
}

@Component({
  selector: 'pg-input-surface-search-example',
  imports: [FormField, LucideSearch, Button, InputSurface, InputSurfaceControl, Join, JoinItem, Kbd, Label],
  templateUrl: './search.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputSurfaceSearchExample {
  protected readonly model: WritableSignal<SearchModel> = signal<SearchModel>({ query: '' });
  protected readonly form: FieldTree<SearchModel> = form(this.model);

  protected reset(): void {
    this.form().reset({ query: '' });
  }
}
