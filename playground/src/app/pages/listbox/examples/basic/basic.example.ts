import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { FieldTree, form, FormField } from '@angular/forms/signals';
import { Label, Listbox, ListboxModelValue, ListboxOption } from '@sushi-kit/angular';

interface WorkspaceForm {
  workspace: ListboxModelValue;
}

@Component({
  selector: 'pg-listbox-basic-example',
  imports: [FormField, Label, Listbox],
  templateUrl: './basic.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListboxBasicExample {
  protected readonly workspaces: readonly ListboxOption[] = [
    { label: 'Product design', value: 'design' },
    { label: 'Engineering', value: 'engineering' },
    { label: 'Research', value: 'research' },
    { label: 'Operations', value: 'operations' },
  ];
  protected readonly model: WritableSignal<WorkspaceForm> = signal<WorkspaceForm>({ workspace: 'design' });
  protected readonly workspaceForm: FieldTree<WorkspaceForm> = form(this.model);
}
