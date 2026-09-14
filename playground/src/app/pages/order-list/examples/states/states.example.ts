import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { OrderList, OrderListOption } from '@sushi-kit/angular';

@Component({
  selector: 'pg-order-list-states-example',
  imports: [OrderList],
  templateUrl: './states.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderListStatesExample {
  protected readonly steps: WritableSignal<readonly OrderListOption[]> = signal([
    { label: 'Collect requirements', value: 'requirements' },
    { label: 'Create prototype', value: 'prototype' },
    { label: 'Run accessibility review', value: 'accessibility' },
    { label: 'Publish release', value: 'release' },
  ]);
}
