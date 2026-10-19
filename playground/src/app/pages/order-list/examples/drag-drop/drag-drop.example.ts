import { ChangeDetectionStrategy, Component, signal, type WritableSignal } from '@angular/core';
import { OrderList, OrderListItemTemplate, type OrderListOption } from '@sushi-kit/angular';

@Component({
  selector: 'pg-order-list-drag-drop-example',
  imports: [OrderList, OrderListItemTemplate],
  templateUrl: './drag-drop.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderListDragDropExample {
  protected readonly movies: WritableSignal<readonly OrderListOption[]> = signal([
    { label: 'The Shawshank Redemption', value: 'shawshank' },
    { label: 'Inception', value: 'inception' },
    { label: 'Interstellar', value: 'interstellar' },
    { label: 'The Dark Knight', value: 'dark-knight' },
    { label: 'Parasite', value: 'parasite' },
  ]);
}
