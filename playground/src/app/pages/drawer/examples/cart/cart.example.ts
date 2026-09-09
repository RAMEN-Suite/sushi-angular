import { ChangeDetectionStrategy, Component, computed, Signal, signal, WritableSignal } from '@angular/core';
import { LucideMinus, LucidePlus, LucideShoppingBag, LucideTrash2, LucideX } from '@lucide/angular';
import {
  Badge,
  Button,
  Drawer,
  DrawerClose,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
  List,
  ListItemTemplate,
} from '@ramen-suite/sushi';

interface CartItem {
  readonly id: number;
  readonly name: string;
  readonly detail: string;
  readonly image: string;
  readonly price: number;
  readonly quantity: number;
}

@Component({
  selector: 'pg-drawer-cart-example',
  imports: [
    Badge,
    Button,
    Drawer,
    DrawerClose,
    DrawerFooter,
    DrawerHeader,
    DrawerTrigger,
    List,
    ListItemTemplate,
    LucideMinus,
    LucidePlus,
    LucideShoppingBag,
    LucideTrash2,
    LucideX,
  ],
  templateUrl: './cart.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawerCartExample {
  protected readonly items: WritableSignal<readonly CartItem[]> = signal([
    { id: 1, name: 'Stoneware ramen bowl', detail: 'Sand · 18 cm', image: '🍜', price: 28, quantity: 1 },
    { id: 2, name: 'Hinoki chopsticks', detail: 'Natural wood · Pair', image: '🥢', price: 14, quantity: 2 },
    { id: 3, name: 'Matcha whisk', detail: 'Bamboo · 80 prongs', image: '🍵', price: 19, quantity: 1 },
  ]);
  protected readonly itemCount: Signal<number> = computed(() =>
    this.items().reduce((total: number, item: CartItem): number => total + item.quantity, 0),
  );
  protected readonly subtotal: Signal<number> = computed(() =>
    this.items().reduce((sum: number, item: CartItem): number => sum + item.price * item.quantity, 0),
  );
  protected readonly shipping: Signal<number> = computed(() => (this.subtotal() >= 60 ? 0 : 5));
  protected readonly total: Signal<number> = computed(() => this.subtotal() + this.shipping());

  protected changeQuantity(id: number, change: number): void {
    this.items.update((items: readonly CartItem[]): readonly CartItem[] =>
      items.map((item: CartItem): CartItem =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + change) } : item,
      ),
    );
  }

  protected removeItem(id: number): void {
    this.items.update((items: readonly CartItem[]): readonly CartItem[] => items.filter((item: CartItem) => item.id !== id));
  }
}
