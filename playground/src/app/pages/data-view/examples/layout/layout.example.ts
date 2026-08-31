import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge, Button, Card, CardActions, CardTitle, DataView, DataViewItemTemplate } from '@ramen-suite/sushi';
import { LucideShoppingCart } from '@lucide/angular';

interface Product {
  readonly id: number;
  readonly name: string;
  readonly category: string;
  readonly description: string;
  readonly code: string;
  readonly price: number;
  readonly stock: 'Available' | 'Low stock';
}

@Component({
  selector: 'pg-data-view-layout-example',
  imports: [Badge, Button, Card, CardActions, CardTitle, DataView, DataViewItemTemplate, LucideShoppingCart],
  templateUrl: './layout.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataViewLayoutExample {
  protected readonly products: readonly Product[] = [
    {
      id: 1,
      name: 'Studio headphones',
      category: 'Audio',
      description: 'Spatial sound with a lightweight studio fit.',
      code: 'SH',
      price: 189,
      stock: 'Available',
    },
    {
      id: 2,
      name: 'Mechanical keyboard',
      category: 'Workspace',
      description: 'Quiet tactile switches in a compact layout.',
      code: 'MK',
      price: 129,
      stock: 'Low stock',
    },
    {
      id: 3,
      name: 'Portable speaker',
      category: 'Audio',
      description: 'Room-filling sound for work and weekends.',
      code: 'PS',
      price: 95,
      stock: 'Available',
    },
    {
      id: 4,
      name: 'Desk light',
      category: 'Workspace',
      description: 'Adaptive warm light with touch controls.',
      code: 'DL',
      price: 72,
      stock: 'Available',
    },
  ];
}
