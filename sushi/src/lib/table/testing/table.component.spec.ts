import { Component, signal, WritableSignal } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { query, queryAll, render } from '../../../../testing/test-utils';
import { Table } from '../table.component';
import type { TableColumn, TableSort } from '../table.interfaces';
import {
  TableCaptionTemplate,
  TableCellTemplate,
  TableEmptyTemplate,
  TableFooterTemplate,
  TableHeaderTemplate,
  TableLoadingTemplate,
  TableRowTemplate,
} from '../table.templates';

const columns: readonly TableColumn<string>[] = [
  { key: 'name', header: 'Name', value: (row: string): string => row, sortable: true, rowHeader: true },
  { key: 'length', header: 'Length', value: (row: string): number => row.length, sortable: true, align: 'end' },
];

@Component({
  imports: [
    Table,
    TableCaptionTemplate,
    TableCellTemplate,
    TableEmptyTemplate,
    TableFooterTemplate,
    TableHeaderTemplate,
    TableLoadingTemplate,
  ],
  template: `
    <sui-table ariaLabel="Ramen inventory" [columns]="columns" [loading]="loading()" [rows]="rows()" [(sort)]="sort">
      <ng-template suiTableCaption let-rows
        ><span data-caption>{{ rows.length }} recipes</span></ng-template
      >
      <ng-template suiTableHeader let-column let-direction="direction">
        <span [attr.data-header]="column.key" [attr.data-direction]="direction">{{ column.header }}</span>
      </ng-template>
      <ng-template suiTableCell let-value let-rowIndex="rowIndex" let-columnIndex="columnIndex">
        <span [attr.data-cell]="rowIndex + '-' + columnIndex">{{ value }}</span>
      </ng-template>
      <ng-template suiTableEmpty><span data-empty>No recipes</span></ng-template>
      <ng-template suiTableLoading><span data-loading>Loading recipes</span></ng-template>
      <ng-template suiTableFooter let-rows
        ><span data-footer>{{ rows.length }} total</span></ng-template
      >
    </sui-table>
  `,
})
class TableHost {
  public readonly loading: WritableSignal<boolean> = signal<boolean>(false);
  public readonly rows: WritableSignal<readonly string[]> = signal<readonly string[]>(['Miso', 'Shoyu']);
  public readonly sort: WritableSignal<TableSort | null> = signal<TableSort | null>(null);
  public readonly columns: readonly TableColumn<string>[] = columns;
}

@Component({
  imports: [Table],
  template: `
    <sui-table
      caption="Inventory"
      [columns]="columns()"
      [rows]="rows()"
      [loading]="loading()"
      [stickyHeader]="true"
      [pinFirstColumn]="true"
    />
  `,
})
class DefaultTableHost {
  public readonly columns: WritableSignal<readonly TableColumn<string>[]> = signal<readonly TableColumn<string>[]>(columns);
  public readonly rows: WritableSignal<readonly string[]> = signal<readonly string[]>(['Miso']);
  public readonly loading: WritableSignal<boolean> = signal<boolean>(false);
}

@Component({
  imports: [Table, TableRowTemplate],
  template: `
    <sui-table [columns]="columns" [rows]="rows">
      <ng-template suiTableRow let-row let-rowIndex="rowIndex">
        <tr>
          <td [attr.data-row]="rowIndex">{{ row }}</td>
        </tr>
      </ng-template>
    </sui-table>
  `,
})
class RowTableHost {
  public readonly columns: readonly TableColumn<string>[] = columns;
  public readonly rows: readonly string[] = ['Miso', 'Shoyu'];
}

describe('Table native structure and templates', (): void => {
  it('renders accessible native table semantics and typed contexts', (): void => {
    const fixture: ComponentFixture<TableHost> = render(TableHost);
    const table: HTMLTableElement = query(fixture, 'table');

    expect(table.getAttribute('aria-label')).toBe('Ramen inventory');
    expect(queryAll(fixture, 'thead th')).toHaveLength(2);
    expect(queryAll(fixture, 'tbody tr')).toHaveLength(2);
    expect(queryAll(fixture, 'tbody th[scope="row"]')).toHaveLength(2);
    expect(query(fixture, '[data-caption]').textContent).toBe('2 recipes');
    expect(query(fixture, '[data-cell="0-0"]').textContent).toBe('Miso');
    expect(query(fixture, '[data-cell="1-1"]').textContent).toBe('5');
    expect(query(fixture, '[data-footer]').textContent).toBe('2 total');
  });

  it('maps column alignment and sort semantics', (): void => {
    const fixture: ComponentFixture<TableHost> = render(TableHost);
    const headings: readonly HTMLTableCellElement[] = queryAll(fixture, 'thead th') as readonly HTMLTableCellElement[];

    expect(headings[0].getAttribute('aria-sort')).toBe('none');
    expect(headings[1].classList.contains('sui-table__cell--end')).toBe(true);
    expect(query(fixture, '[data-header="name"]').getAttribute('data-direction')).toBeNull();
  });

  it('renders the default caption, headers, and cell values without custom templates', (): void => {
    const fixture: ComponentFixture<DefaultTableHost> = render(DefaultTableHost);

    expect(query(fixture, 'caption').textContent.trim()).toBe('Inventory');
    expect(query(fixture, 'thead th').textContent).toContain('Name');
    expect(query(fixture, 'tbody th[scope="row"]').textContent.trim()).toBe('Miso');
    expect(query(fixture, 'tbody td').textContent.trim()).toBe('4');
    expect(query(fixture, 'table').classList).toContain('table-pin-cols');
    expect(query(fixture, 'table').classList).toContain('table-pin-rows');
  });

  it('renders a custom row with its row index', (): void => {
    const fixture: ComponentFixture<RowTableHost> = render(RowTableHost);

    expect(query(fixture, '[data-row="1"]').textContent.trim()).toBe('Shoyu');
    expect(queryAll(fixture, 'tbody tr')).toHaveLength(2);
  });
});

describe('Table controlled sorting', (): void => {
  it('cycles ascending, descending, and unsorted states', (): void => {
    const fixture: ComponentFixture<TableHost> = render(TableHost);
    const sortName: HTMLButtonElement = queryAll(fixture, 'button')[0];
    sortName.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.sort()).toEqual({ key: 'name', direction: 'ascending' });
    expect(queryAll(fixture, 'thead th')[0].getAttribute('aria-sort')).toBe('ascending');

    sortName.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.sort()).toEqual({ key: 'name', direction: 'descending' });

    sortName.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.sort()).toBeNull();
  });

  it('switches sorting to another column', (): void => {
    const fixture: ComponentFixture<TableHost> = render(TableHost);
    const sortLength: HTMLButtonElement = queryAll(fixture, 'button')[1];
    fixture.componentInstance.sort.set({ key: 'name', direction: 'descending' });
    fixture.detectChanges();
    sortLength.click();

    expect(fixture.componentInstance.sort()).toEqual({ key: 'length', direction: 'ascending' });
  });
});

describe('Table collection states', (): void => {
  it('renders a custom empty row spanning all columns', (): void => {
    const fixture: ComponentFixture<TableHost> = render(TableHost);
    fixture.componentInstance.rows.set([]);
    fixture.detectChanges();

    expect(query(fixture, '[data-empty]').textContent).toBe('No recipes');
    expect(query(fixture, 'tbody td').getAttribute('colspan')).toBe('2');
  });

  it('renders loading state and blocks sorting without losing focus', (): void => {
    const fixture: ComponentFixture<TableHost> = render(TableHost);
    const sortName: HTMLButtonElement = queryAll(fixture, 'button')[0];
    fixture.componentInstance.loading.set(true);
    fixture.detectChanges();
    sortName.focus();
    sortName.click();

    expect(document.activeElement).toBe(sortName);
    expect(sortName.getAttribute('aria-disabled')).toBe('true');
    expect(query(fixture, 'table').getAttribute('aria-busy')).toBe('true');
    expect(query(fixture, '[data-loading]').textContent).toBe('Loading recipes');
    expect(fixture.componentInstance.sort()).toBeNull();
  });

  it('announces default empty and loading states with at least one spanning column', (): void => {
    const fixture: ComponentFixture<DefaultTableHost> = render(DefaultTableHost);
    fixture.componentInstance.columns.set([]);
    fixture.componentInstance.rows.set([]);
    fixture.detectChanges();

    expect(query(fixture, 'tbody td').getAttribute('colspan')).toBe('1');
    expect(query(fixture, 'tbody').textContent).toContain('No records found');

    fixture.componentInstance.loading.set(true);
    fixture.detectChanges();
    expect(query(fixture, '[role="status"]').textContent).toContain('Loading records');
    expect(query(fixture, 'table').getAttribute('aria-busy')).toBe('true');
  });
});
