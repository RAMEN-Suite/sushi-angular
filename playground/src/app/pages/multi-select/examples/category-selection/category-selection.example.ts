import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { LucideCreditCard, LucideFolderKanban, LucideUsers } from '@lucide/angular';
import {
  Badge,
  Card,
  CardTitle,
  Checkbox,
  Label,
  MultiSelect,
  MultiSelectGroupTemplate,
  MultiSelectItemTemplate,
  MultiSelectModelValue,
  MultiSelectOption,
  MultiSelectValue,
  Progress,
} from '@sushi-kit/angular';

interface Permission extends MultiSelectOption {
  readonly description: string;
}

@Component({
  selector: 'pg-multi-select-category-selection-example',
  imports: [
    Badge,
    Card,
    CardTitle,
    Checkbox,
    Label,
    MultiSelect,
    MultiSelectGroupTemplate,
    MultiSelectItemTemplate,
    Progress,
    LucideCreditCard,
    LucideFolderKanban,
    LucideUsers,
  ],
  templateUrl: './category-selection.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiSelectCategorySelectionExample {
  protected readonly groups: readonly string[] = ['Members', 'Projects', 'Billing'];
  protected readonly permissions: readonly Permission[] = [
    { label: 'Invite members', description: 'Add people to the workspace.', value: 'members:invite', group: 'Members' },
    { label: 'Manage roles', description: 'Change roles and access levels.', value: 'members:roles', group: 'Members' },
    { label: 'Edit projects', description: 'Update project details and content.', value: 'projects:edit', group: 'Projects' },
    {
      label: 'Archive projects',
      description: 'Move completed projects to the archive.',
      value: 'projects:archive',
      group: 'Projects',
    },
    { label: 'View invoices', description: 'Read invoices and payment history.', value: 'billing:view', group: 'Billing' },
    {
      label: 'Manage payments',
      description: 'Update payment methods and billing data.',
      value: 'billing:manage',
      group: 'Billing',
    },
  ];
  protected readonly value: WritableSignal<MultiSelectModelValue> = signal<MultiSelectModelValue>([
    'members:invite',
    'members:roles',
    'projects:edit',
  ]);

  protected asPermission(option: MultiSelectOption): Permission {
    return option as Permission;
  }

  protected selectedCount(group: string): number {
    return this.groupOptions(group).filter((option: Permission): boolean => this.selected(option)).length;
  }

  protected groupSize(group: string): number {
    return this.groupOptions(group).length;
  }

  protected groupSelected(group: string): boolean {
    return this.selectedCount(group) === this.groupSize(group);
  }

  protected groupPartial(group: string): boolean {
    const selected: number = this.selectedCount(group);
    return selected > 0 && selected < this.groupSize(group);
  }

  protected toggleGroup(group: string): void {
    const options: readonly Permission[] = this.groupOptions(group);
    const remove: boolean = this.groupSelected(group);
    this.value.update((value: MultiSelectModelValue): MultiSelectModelValue =>
      remove
        ? value.filter((selected: MultiSelectValue): boolean =>
            options.every((option: Permission): boolean => option.value !== selected),
          )
        : [
            ...value,
            ...options
              .filter((option: Permission): boolean => !this.selected(option))
              .map((option: Permission): MultiSelectValue => option.value),
          ],
    );
  }

  private groupOptions(group: string): readonly Permission[] {
    return this.permissions.filter((option: Permission): boolean => option.group === group);
  }

  private selected(option: Permission): boolean {
    return this.value().includes(option.value);
  }
}
