import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Table } from '@sushi-kit/angular';
import type { TableColumn } from '@sushi-kit/angular';
import { THEME_TOKENS } from './theme-token-table.data';
import type { ThemeToken } from './theme-token-table.data';

@Component({
  selector: 'pg-theme-token-table',
  imports: [Table],
  templateUrl: './theme-token-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeTokenTable {
  protected readonly tokens: readonly ThemeToken[] = THEME_TOKENS;
  protected readonly columns: readonly TableColumn<ThemeToken>[] = [
    { key: 'group', header: 'Group', value: (token: ThemeToken): string => token.group, minWidth: '7rem' },
    { key: 'token', header: 'Token', value: (token: ThemeToken): string => token.token, minWidth: '14rem', rowHeader: true },
    { key: 'default', header: 'Light default', value: (token: ThemeToken): string => token.defaultValue, minWidth: '9rem' },
    { key: 'purpose', header: 'Purpose', value: (token: ThemeToken): string => token.purpose, minWidth: '15rem' },
  ];
}
