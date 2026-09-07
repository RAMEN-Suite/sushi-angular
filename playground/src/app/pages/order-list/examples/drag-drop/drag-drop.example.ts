import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { Checkbox, Label, OrderList, OrderListItemTemplate, OrderListOption } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-order-list-drag-drop-example',
  imports: [Checkbox, Label, OrderList, OrderListItemTemplate],
  templateUrl: './drag-drop.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderListDragDropExample {
  protected readonly movies: WritableSignal<readonly OrderListOption[]> = signal<readonly OrderListOption[]>([
    { label: 'The Shawshank Redemption', value: 'shawshank' },
    { label: 'Inception', value: 'inception' },
    { label: 'Interstellar', value: 'interstellar' },
    { label: 'The Dark Knight', value: 'dark-knight' },
    { label: 'Parasite', value: 'parasite' },
  ]);
}
