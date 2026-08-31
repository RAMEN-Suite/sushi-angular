import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Badge, Table, TableCellTemplate, TableColumn } from '@ramen-suite/sushi';

type ReleaseState = 'Ready' | 'Review' | 'Blocked';

interface Release {
  readonly name: string;
  readonly owner: string;
  readonly state: ReleaseState;
  readonly updated: string;
}

@Component({
  selector: 'pg-table-mobile-example',
  imports: [Badge, Table, TableCellTemplate],
  templateUrl: './mobile.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableMobileExample {
  protected readonly columns: readonly TableColumn<Release>[] = [
    {
      key: 'name',
      header: 'Release',
      value: (release: Release): string => release.name,
      minWidth: '10rem',
      rowHeader: true,
    },
    { key: 'owner', header: 'Owner', value: (release: Release): string => release.owner, minWidth: '10rem' },
    { key: 'state', header: 'State', value: (release: Release): ReleaseState => release.state, minWidth: '8rem' },
    { key: 'updated', header: 'Updated', value: (release: Release): string => release.updated, minWidth: '8rem' },
  ];
  protected readonly releases: readonly Release[] = [
    { name: 'Mobile navigation', owner: 'Mina Park', state: 'Ready', updated: 'Today' },
    { name: 'Billing workflow', owner: 'Noah Williams', state: 'Review', updated: 'Yesterday' },
    { name: 'Usage reports', owner: 'Jamie Chen', state: 'Blocked', updated: 'Aug 28' },
  ];

  protected severity(state: ReleaseState): 'success' | 'warning' | 'error' {
    if (state === 'Ready') return 'success';
    if (state === 'Review') return 'warning';
    return 'error';
  }
}
