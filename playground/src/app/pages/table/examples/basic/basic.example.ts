import { ChangeDetectionStrategy, Component, computed, signal, Signal, WritableSignal } from '@angular/core';
import { FieldTree, form, FormField } from '@angular/forms/signals';
import { Input, Label, Pagination, Table, TableColumn, TableSort } from '@sushi-kit/angular';

interface InvoiceFilters {
  query: string;
}

interface Invoice {
  readonly id: string;
  readonly customer: string;
  readonly status: string;
  readonly total: number;
}

@Component({
  selector: 'pg-table-basic-example',
  imports: [FormField, Input, Label, Pagination, Table],
  templateUrl: './basic.example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableBasicExample {
  protected readonly filters: WritableSignal<InvoiceFilters> = signal<InvoiceFilters>({ query: '' });
  protected readonly filterForm: FieldTree<InvoiceFilters> = form(this.filters);
  protected readonly page: WritableSignal<number> = signal<number>(1);
  protected readonly pageSize: number = 4;
  protected readonly sort: WritableSignal<TableSort | null> = signal<TableSort | null>(null);
  protected readonly columns: readonly TableColumn<Invoice>[] = [
    { key: 'id', header: 'Invoice', value: (invoice: Invoice): string => invoice.id, minWidth: '7rem', rowHeader: true },
    {
      key: 'customer',
      header: 'Customer',
      value: (invoice: Invoice): string => invoice.customer,
      sortable: true,
      minWidth: '11rem',
    },
    { key: 'status', header: 'Status', value: (invoice: Invoice): string => invoice.status, minWidth: '7rem' },
    {
      key: 'total',
      header: 'Total',
      value: (invoice: Invoice): string => invoice.total.toLocaleString('en-US') + ' €',
      sortable: true,
      align: 'end',
      minWidth: '8rem',
    },
  ];
  protected readonly invoices: readonly Invoice[] = [
    { id: 'INV-1048', customer: 'Northstar Labs', status: 'Paid', total: 4280 },
    { id: 'INV-1049', customer: 'Acme Studio', status: 'Pending', total: 1850 },
    { id: 'INV-1050', customer: 'Orbit Systems', status: 'Paid', total: 6950 },
    { id: 'INV-1051', customer: 'Harbor Works', status: 'Overdue', total: 2240 },
    { id: 'INV-1052', customer: 'Juniper Labs', status: 'Pending', total: 3720 },
    { id: 'INV-1053', customer: 'Vertex Studio', status: 'Paid', total: 5100 },
    { id: 'INV-1054', customer: 'Cobalt Systems', status: 'Paid', total: 2960 },
  ];
  protected readonly filteredInvoices: Signal<readonly Invoice[]> = computed((): readonly Invoice[] => {
    const query: string = this.filterForm.query().value().trim().toLowerCase();
    if (!query) return this.invoices;
    return this.invoices.filter((invoice: Invoice): boolean =>
      [invoice.id, invoice.customer, invoice.status].some((value: string): boolean => value.toLowerCase().includes(query)),
    );
  });
  protected readonly sortedInvoices: Signal<readonly Invoice[]> = computed((): readonly Invoice[] => {
    const sort: TableSort | null = this.sort();
    if (!sort) return this.filteredInvoices();

    const direction: number = sort.direction === 'ascending' ? 1 : -1;
    return [...this.filteredInvoices()].sort((left: Invoice, right: Invoice): number => {
      if (sort.key === 'total') return (left.total - right.total) * direction;
      return left.customer.localeCompare(right.customer) * direction;
    });
  });
  protected readonly visibleInvoices: Signal<readonly Invoice[]> = computed((): readonly Invoice[] => {
    const start: number = (this.page() - 1) * this.pageSize;
    return this.sortedInvoices().slice(start, start + this.pageSize);
  });

  protected handleSort(sort: TableSort | null): void {
    this.sort.set(sort);
    this.page.set(1);
  }

  protected resetPage(): void {
    this.page.set(1);
  }
}
