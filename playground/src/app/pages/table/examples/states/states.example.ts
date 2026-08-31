import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { Button, Table, TableColumn } from '@ramen-suite/sushi';

interface Deployment {
  readonly environment: string;
  readonly version: string;
}

@Component({
  selector: 'pg-table-states-example',
  imports: [Button, Table],
  templateUrl: './states.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableStatesExample {
  protected readonly loading: WritableSignal<boolean> = signal<boolean>(true);
  protected readonly columns: readonly TableColumn<Deployment>[] = [
    {
      key: 'environment',
      header: 'Environment',
      value: (deployment: Deployment): string => deployment.environment,
      rowHeader: true,
    },
    { key: 'version', header: 'Version', value: (deployment: Deployment): string => deployment.version },
  ];

  protected toggleLoading(): void {
    this.loading.update((loading: boolean): boolean => !loading);
  }
}
