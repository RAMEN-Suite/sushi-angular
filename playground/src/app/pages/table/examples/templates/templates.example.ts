import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LucideBoxes, LucidePackageOpen } from '@lucide/angular';
import {
  Badge,
  Table,
  TableCaptionTemplate,
  TableColumn,
  TableEmptyTemplate,
  TableFooterTemplate,
  TableHeaderTemplate,
  TableLoadingTemplate,
  TableRowTemplate,
} from '@ramen-suite/sushi';

type StockState = 'Healthy' | 'Low';

interface StockItem {
  readonly sku: string;
  readonly product: string;
  readonly stock: number;
  readonly state: StockState;
}

@Component({
  selector: 'pg-table-templates-example',
  imports: [
    Badge,
    LucideBoxes,
    LucidePackageOpen,
    Table,
    TableCaptionTemplate,
    TableEmptyTemplate,
    TableFooterTemplate,
    TableHeaderTemplate,
    TableLoadingTemplate,
    TableRowTemplate,
  ],
  templateUrl: './templates.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableTemplatesExample {
  protected readonly columns: readonly TableColumn<StockItem>[] = [
    { key: 'product', header: 'Product', value: (item: StockItem): string => item.product, minWidth: '14rem' },
    {
      key: 'stock',
      header: 'Available',
      value: (item: StockItem): number => item.stock,
      align: 'end',
      minWidth: '8rem',
    },
    {
      key: 'state',
      header: 'State',
      value: (item: StockItem): StockState => item.state,
      align: 'end',
      minWidth: '9rem',
    },
  ];
  protected readonly items: readonly StockItem[] = [
    { sku: 'DS-204', product: 'Interface kit', stock: 48, state: 'Healthy' },
    { sku: 'DS-219', product: 'Prototype deck', stock: 7, state: 'Low' },
    { sku: 'DS-231', product: 'Research cards', stock: 26, state: 'Healthy' },
  ];
}
