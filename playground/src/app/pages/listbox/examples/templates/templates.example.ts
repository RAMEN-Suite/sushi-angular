import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { FieldTree, form, FormField } from '@angular/forms/signals';
import {
  Avatar,
  Badge,
  Label,
  Listbox,
  ListboxEmptyFilterTemplate,
  ListboxGroupTemplate,
  ListboxItemTemplate,
  ListboxModelValue,
  ListboxOption,
} from '@ramen-suite/sushi';

interface ReviewerOption extends ListboxOption {
  readonly role: string;
  readonly initials: string;
}

interface ReviewerForm {
  reviewer: ListboxModelValue;
}

@Component({
  selector: 'pg-listbox-templates-example',
  imports: [Avatar, Badge, FormField, Label, Listbox, ListboxEmptyFilterTemplate, ListboxGroupTemplate, ListboxItemTemplate],
  templateUrl: './templates.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListboxTemplatesExample {
  protected readonly reviewers: readonly ReviewerOption[] = [
    { label: 'Ada Lovelace', value: 'ada', group: 'Available today', role: 'Engineering', initials: 'AL' },
    { label: 'Grace Hopper', value: 'grace', group: 'Available today', role: 'Platform', initials: 'GH' },
    {
      label: 'Katherine Johnson',
      value: 'katherine',
      group: 'Away',
      role: 'Research',
      initials: 'KJ',
      disabled: true,
    },
  ];
  protected readonly model: WritableSignal<ReviewerForm> = signal<ReviewerForm>({ reviewer: 'ada' });
  protected readonly reviewerForm: FieldTree<ReviewerForm> = form(this.model);
}
