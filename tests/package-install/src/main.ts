import { ChangeDetectionStrategy, Component, signal, type WritableSignal } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import {
  Button,
  Chip,
  ToggleButton,
  Select,
  type SelectOption,
  SelectItemTemplate,
  SelectSelectedItemTemplate,
  DataView,
  DataViewItemTemplate,
  Table,
  type TableColumn,
  TableRowTemplate,
} from '@sushi-kit/angular';

interface ConsumerOption extends SelectOption {
  readonly detail: string;
}

@Component({
  selector: 'app-root',
  imports: [
    Button,
    Chip,
    ToggleButton,
    Select,
    SelectItemTemplate,
    SelectSelectedItemTemplate,
    DataView,
    DataViewItemTemplate,
    Table,
    TableRowTemplate,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button suiButton severity="primary" type="button">Save</button>
    <sui-chip label="Extra small" size="xs" />
    <sui-chip label="Large" size="lg" />
    <sui-toggle-button ariaLabel="Pin item" [(checked)]="pinned" />
    <p>{{ pinned() ? 'Pinned' : 'Not pinned' }}</p>
    <sui-select [options]="options" [value]="'miso'" clearLabel="Clear team">
      <ng-template [suiSelectItem]="options" let-option>{{ option.detail }}</ng-template>
      <ng-template [suiSelectSelectedItem]="options" let-option>{{ option.detail }}</ng-template>
    </sui-select>
    <sui-data-view [items]="options">
      <ng-template [suiDataViewItem]="options" let-item>{{ item.detail }}</ng-template>
    </sui-data-view>
    <sui-table [rows]="options" [columns]="columns">
      <ng-template [suiTableRow]="options" let-row
        ><tr>
          <td>{{ row.detail }}</td>
        </tr></ng-template
      >
    </sui-table>
  `,
})
class App {
  protected readonly options: readonly ConsumerOption[] = [{ label: 'Miso', value: 'miso', detail: 'Design team' }];
  protected readonly columns: readonly TableColumn<ConsumerOption>[] = [{ key: 'detail', header: 'Detail' }];
  protected readonly pinned: WritableSignal<boolean> = signal(false);
}

bootstrapApplication(App).catch((error: unknown): void => {
  console.error(error);
});
