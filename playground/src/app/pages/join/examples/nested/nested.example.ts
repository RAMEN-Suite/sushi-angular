import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { LucideChevronDown, LucideChevronUp } from '@lucide/angular';
import { Button, Input, Join, JoinItem } from '@ramen-suite/sushi';

@Component({
  selector: 'pg-join-nested-example',
  imports: [LucideChevronDown, LucideChevronUp, Button, Input, Join, JoinItem],
  templateUrl: './nested.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JoinNestedExample {
  protected readonly quantity: WritableSignal<number> = signal<number>(2);

  protected adjust(amount: number): void {
    this.quantity.update((quantity: number): number => Math.max(1, quantity + amount));
  }

  protected reset(): void {
    this.quantity.set(2);
  }
}
