import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { FieldTree, form, FormField } from '@angular/forms/signals';
import { Button, Label, Listbox, ListboxModelValue, ListboxOption } from '@ramen-suite/sushi';

interface WorkspaceForm {
  workspace: ListboxModelValue;
}

@Component({
  selector: 'pg-listbox-basic-example',
  imports: [Button, FormField, Label, Listbox],
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

  protected reset(): void {
    this.workspaceForm().reset({ workspace: 'design' });
  }
}
