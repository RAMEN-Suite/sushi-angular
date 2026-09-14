import { ChangeDetectionStrategy, Component, computed, Signal, signal, WritableSignal } from '@angular/core';
import {
  Badge,
  Button,
  Card,
  DataView,
  DataViewEmptyTemplate,
  DataViewFooterTemplate,
  DataViewItemTemplate,
  DataViewLoadingTemplate,
  Spinner,
} from '@sushi-kit/angular';

interface Deployment {
  readonly id: number;
  readonly environment: string;
  readonly version: string;
}

const deployments: readonly Deployment[] = Array.from({ length: 18 }, (_value: unknown, index: number): Deployment => ({
  id: index + 1,
  environment: index % 2 === 0 ? 'Production' : 'Preview',
  version: `2.${Math.floor(index / 3)}.${index % 3}`,
}));

@Component({
  selector: 'pg-data-view-remote-example',
  imports: [
    Badge,
    Button,
    Card,
    DataView,
    DataViewEmptyTemplate,
    DataViewFooterTemplate,
    DataViewItemTemplate,
    DataViewLoadingTemplate,
    Spinner,
  ],
  templateUrl: './remote.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataViewRemoteExample {
  protected readonly page: WritableSignal<number> = signal<number>(1);
  protected readonly loading: WritableSignal<boolean> = signal<boolean>(false);
  protected readonly pageItems: Signal<readonly Deployment[]> = computed((): readonly Deployment[] => {
    const start: number = (this.page() - 1) * 3;
    return deployments.slice(start, start + 3);
  });

  protected handlePage(page: number): void {
    this.loading.set(true);
    this.page.set(page);
    window.setTimeout((): void => this.loading.set(false), 450);
  }
}
