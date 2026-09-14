import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { LucideLockKeyhole, LucideLockKeyholeOpen, LucideSearch } from '@lucide/angular';
import {
  Badge,
  Button,
  InputSurface,
  InputSurfaceControl,
  Label,
  OrderList,
  OrderListFilterTemplate,
  OrderListHeaderTemplate,
  OrderListItemTemplate,
  OrderListOption,
  OrderListValue,
} from '@sushi-kit/angular';

interface BacklogItem extends OrderListOption {
  readonly area: string;
  readonly effort: number;
}

@Component({
  selector: 'pg-order-list-templates-example',
  imports: [
    Badge,
    Button,
    InputSurface,
    InputSurfaceControl,
    Label,
    LucideLockKeyhole,
    LucideLockKeyholeOpen,
    LucideSearch,
    OrderList,
    OrderListFilterTemplate,
    OrderListHeaderTemplate,
    OrderListItemTemplate,
  ],
  templateUrl: './templates.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderListTemplatesExample {
  private readonly initialBacklog: readonly BacklogItem[] = [
    { label: 'Keyboard shortcuts', value: 'shortcuts', area: 'Accessibility', effort: 3 },
    { label: 'Saved filters', value: 'filters', area: 'Productivity', effort: 5 },
    { label: 'Audit timeline', value: 'timeline', area: 'Reporting', effort: 8 },
    { label: 'Compact navigation', value: 'navigation', area: 'Layout', effort: 2 },
    { label: 'Export presets', value: 'exports', area: 'Reporting', effort: 5 },
  ];

  protected readonly backlog: WritableSignal<readonly BacklogItem[]> = signal(this.initialBacklog);
  protected readonly locked: WritableSignal<boolean> = signal(false);
  protected readonly details: ReadonlyMap<OrderListValue, BacklogItem> = new Map(
    this.initialBacklog.map((item: BacklogItem): readonly [OrderListValue, BacklogItem] => [item.value, item]),
  );

  protected toggleLock(): void {
    this.locked.update((locked: boolean): boolean => !locked);
  }
}
