import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Table } from '@sushi-kit/angular';
import type { TableColumn } from '@sushi-kit/angular';
import { THEME_TOKEN_REFERENCES } from '../../../generated/theme-token-reference.generated';
import type { ThemeTokenReference } from '../../../generated/theme-token-reference.generated';

@Component({
  selector: 'pg-theme-token-table',
  imports: [Table],
  templateUrl: './theme-token-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeTokenTable {
  protected readonly tokens: readonly ThemeTokenReference[] = THEME_TOKEN_REFERENCES;
  protected readonly columns: readonly TableColumn<ThemeTokenReference>[] = [
    { key: 'group', header: 'Group', value: (token: ThemeTokenReference): string => token.group, minWidth: '7rem' },
    {
      key: 'token',
      header: 'Token',
      value: (token: ThemeTokenReference): string => token.token,
      minWidth: '14rem',
      rowHeader: true,
    },
    {
      key: 'light',
      header: 'Light default',
      value: (token: ThemeTokenReference): string => token.lightValue,
      minWidth: '9rem',
    },
    {
      key: 'dark',
      header: 'Dark default',
      value: (token: ThemeTokenReference): string => token.darkValue,
      minWidth: '9rem',
    },
    {
      key: 'purpose',
      header: 'Purpose',
      value: (token: ThemeTokenReference): string => token.purpose,
      minWidth: '15rem',
    },
  ];
}
