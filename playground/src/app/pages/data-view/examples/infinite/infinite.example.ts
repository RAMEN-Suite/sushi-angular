import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  computed,
  type Signal,
  signal,
  type WritableSignal,
} from '@angular/core';
import {
  Badge,
  Button,
  Card,
  CardTitle,
  DataView,
  DataViewItemTemplate,
  DataViewLoadMoreTemplate,
  Spinner,
} from '@sushi-kit/angular';
import { LucideArrowRight } from '@lucide/angular';

interface Resource {
  readonly id: number;
  readonly title: string;
  readonly area: string;
  readonly summary: string;
}

function resourceArea(index: number): string {
  if (index % 3 === 0) return 'Accessibility';
  if (index % 2 === 0) return 'Components';
  return 'Foundations';
}

const resources: readonly Resource[] = Array.from({ length: 18 }, (_value: unknown, index: number): Resource => ({
  id: index + 1,
  title: `Pattern collection ${index + 1}`,
  area: resourceArea(index),
  summary: 'A practical reference for consistent product experiences.',
}));

@Component({
  selector: 'pg-data-view-infinite-example',
  imports: [Badge, Button, Card, CardTitle, DataView, DataViewItemTemplate, DataViewLoadMoreTemplate, LucideArrowRight, Spinner],
  templateUrl: './infinite.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataViewInfiniteExample {
  protected readonly count: WritableSignal<number> = signal<number>(6);
  protected readonly loading: WritableSignal<boolean> = signal<boolean>(false);
  protected readonly items: Signal<readonly Resource[]> = computed((): readonly Resource[] => resources.slice(0, this.count()));
  protected readonly hasMore: Signal<boolean> = computed((): boolean => this.count() < resources.length);

  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private timer: ReturnType<typeof setTimeout> | undefined;

  public constructor() {
    this.destroyRef.onDestroy((): void => clearTimeout(this.timer));
  }

  protected loadMore(): void {
    if (this.loading()) return;
    this.loading.set(true);
    this.timer = setTimeout((): void => {
      this.count.update((count: number): number => Math.min(resources.length, count + 3));
      this.loading.set(false);
    }, 1000);
  }
}
