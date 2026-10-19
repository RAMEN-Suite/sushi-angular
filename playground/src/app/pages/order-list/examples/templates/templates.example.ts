import { CdkScrollable } from '@angular/cdk/scrolling';
import { ChangeDetectionStrategy, Component, signal, type WritableSignal } from '@angular/core';
import {
  LucideArrowDownUp,
  LucideCalendarDays,
  LucideCheck,
  LucideListFilter,
  LucideLockKeyhole,
  LucideType,
} from '@lucide/angular';
import { Button, OrderList, OrderListItemTemplate, type OrderListLabels, type OrderListOption } from '@sushi-kit/angular';

interface Property extends OrderListOption {
  readonly type: 'String' | 'Date';
}

@Component({
  selector: 'pg-order-list-templates-example',
  imports: [
    Button,
    CdkScrollable,
    LucideArrowDownUp,
    LucideCalendarDays,
    LucideCheck,
    LucideListFilter,
    LucideLockKeyhole,
    LucideType,
    OrderList,
    OrderListItemTemplate,
  ],
  templateUrl: './templates.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderListTemplatesExample {
  private readonly saved: WritableSignal<readonly Property[]> = signal([
    { label: 'mentions', value: 'mentions', type: 'String', disabled: true },
    { label: 'created', value: 'created', type: 'Date' },
    { label: 'description', value: 'description', type: 'String' },
    ...Array.from({ length: 9 }, (_: unknown, index: number): Property => ({
      label: `Property ${index + 4}`,
      value: `property-${index + 4}`,
      type: 'String',
    })),
  ]);
  protected readonly draft: WritableSignal<readonly Property[]> = signal(this.saved());
  protected readonly message: WritableSignal<string> = signal('Choose Sort properties to change the order.');
  protected readonly sorting: WritableSignal<boolean> = signal(false);
  protected readonly labels: Partial<OrderListLabels<Property>> = {
    reorder: (item: Property): string => `${item.label} verschieben`,
    moveUp: 'Nach oben',
    moveDown: 'Nach unten',
    moveToTop: 'An den Anfang',
    moveToBottom: 'Ans Ende',
    empty: 'Keine Eigenschaften',
    instructions:
      'Menü zum Verschieben öffnen. Alt/Option+Pfeil verschiebt einen Platz; mit Umschalt geht es an den Anfang oder ans Ende.',
    moved: (event, count): string => `${event.item.label}: Position ${event.currentIndex + 1} von ${count}`,
  };

  protected start(): void {
    this.draft.set(this.saved());
    this.sorting.set(true);
    this.message.set('Drag or click a handle to reorder.');
  }

  protected cancel(): void {
    this.draft.set(this.saved());
    this.sorting.set(false);
    this.message.set('Changes discarded. The saved order has been restored.');
  }

  protected save(): void {
    this.saved.set(this.draft());
    this.sorting.set(false);
    this.message.set('New order saved.');
  }
}
