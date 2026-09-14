import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Table, TableColumn } from '@sushi-kit/angular';

interface Product {
  readonly code: string;
  readonly name: string;
  readonly category: string;
  readonly quantity: number;
}

@Component({
  selector: 'pg-table-simple-example',
  imports: [Table],
  templateUrl: './simple.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableSimpleExample {
  protected readonly columns: readonly TableColumn<Product>[] = [
    { key: 'code', header: 'Code', value: (product: Product): string => product.code, rowHeader: true },
    { key: 'name', header: 'Name', value: (product: Product): string => product.name },
    { key: 'category', header: 'Category', value: (product: Product): string => product.category },
    { key: 'quantity', header: 'Quantity', value: (product: Product): number => product.quantity, align: 'end' },
  ];
  protected readonly products: readonly Product[] = [
    { code: 'PR-1001', name: 'Bamboo watch', category: 'Accessories', quantity: 24 },
    { code: 'PR-1002', name: 'Black t-shirt', category: 'Clothing', quantity: 42 },
    { code: 'PR-1003', name: 'Blue band', category: 'Fitness', quantity: 18 },
    { code: 'PR-1004', name: 'Game controller', category: 'Electronics', quantity: 12 },
  ];
}
