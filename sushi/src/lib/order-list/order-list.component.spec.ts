import { Component, signal, Signal, viewChild, WritableSignal } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { press, query, queryAll, render } from '../../../testing/test-utils';
import { OrderList } from './order-list.component';
import type { OrderListOption } from './order-list.interfaces';
import { OrderListFilterTemplate, OrderListItemTemplate } from './order-list.templates';

interface WorkItem extends OrderListOption {
  readonly value: string;
  readonly owner: string;
}

const items: readonly WorkItem[] = [
  { label: 'Research', value: 'research', owner: 'Ari' },
  { label: 'Prototype', value: 'prototype', owner: 'Bo' },
  { label: 'Review', value: 'review', owner: 'Cleo', disabled: true },
  { label: 'Release', value: 'release', owner: 'Dee' },
];

@Component({
  imports: [OrderList, OrderListFilterTemplate, OrderListItemTemplate],
  template: `
    <sui-order-list
      ariaLabel="Workflow"
      filter
      [disabled]="disabled()"
      [invalid]="invalid()"
      [touched]="touched()"
      [(value)]="value"
      (touch)="touches += 1"
    >
      <ng-template suiOrderListFilter let-query let-update="update">
        <input data-filter [value]="query" (input)="update($any($event.target).value)" />
      </ng-template>
      <ng-template suiOrderListItem let-item let-index="index" let-selected="selected">
        <span [attr.data-item]="item.value" [attr.data-index]="index" [attr.data-selected]="selected">
          {{ item.label }}
        </span>
      </ng-template>
    </sui-order-list>
  `,
})
class OrderListHost {
  public readonly control: Signal<OrderList<WorkItem>> = viewChild.required(OrderList<WorkItem>);
  public readonly disabled: WritableSignal<boolean> = signal<boolean>(false);
  public readonly invalid: WritableSignal<boolean> = signal<boolean>(false);
  public readonly touched: WritableSignal<boolean> = signal<boolean>(false);
  public readonly value: WritableSignal<readonly WorkItem[]> = signal<readonly WorkItem[]>(items);
  public touches: number = 0;
}

function select(fixture: ComponentFixture<OrderListHost>, value: string): void {
  const content: HTMLElement = query(fixture, `[data-item="${value}"]`) as HTMLElement;
  const option: HTMLElement | null = content.closest<HTMLElement>('[role="option"]');
  if (option === null) throw new Error(`Expected "${value}" to be rendered inside an option.`);
  option.click();
  fixture.detectChanges();
}

function values(fixture: ComponentFixture<OrderListHost>): readonly string[] {
  return fixture.componentInstance.value().map((item: WorkItem): string => item.value);
}

describe('OrderList value and templates', (): void => {
  it('renders typed custom items and filters them', (): void => {
    const fixture: ComponentFixture<OrderListHost> = render(OrderListHost);
    expect(queryAll(fixture, '[role="option"]')).toHaveLength(4);
    expect(query(fixture, '[data-item="prototype"]').textContent.trim()).toBe('Prototype');

    const filter: HTMLInputElement = query(fixture, 'input');
    filter.value = 'release';
    filter.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    expect(queryAll(fixture, '[role="option"]')).toHaveLength(1);
    expect(query(fixture, '[data-item="release"]')).toBeTruthy();
  });

  it('reflects external order updates', (): void => {
    const fixture: ComponentFixture<OrderListHost> = render(OrderListHost);
    fixture.componentInstance.value.set([...items].reverse());
    fixture.detectChanges();
    expect(values(fixture)).toEqual(['release', 'review', 'prototype', 'research']);
  });
});

describe('OrderList reordering', (): void => {
  it('moves the selection with the navigation actions', (): void => {
    const fixture: ComponentFixture<OrderListHost> = render(OrderListHost);
    select(fixture, 'prototype');

    const moveUp: HTMLButtonElement = query(fixture, '[aria-label="Move selected items up"]') as HTMLButtonElement;
    moveUp.click();
    fixture.detectChanges();
    expect(values(fixture)).toEqual(['prototype', 'research', 'review', 'release']);

    const moveBottom: HTMLButtonElement = query(fixture, '[aria-label="Move selected items to bottom"]') as HTMLButtonElement;
    moveBottom.click();
    fixture.detectChanges();
    expect(values(fixture)).toEqual(['research', 'review', 'release', 'prototype']);
    expect(fixture.componentInstance.touches).toBe(2);
    expect(query(fixture, '[aria-live="polite"]').textContent).toContain('Order updated');
  });

  it('supports the documented Alt keyboard shortcuts', (): void => {
    const fixture: ComponentFixture<OrderListHost> = render(OrderListHost);
    const listbox: HTMLElement = query(fixture, '[role="listbox"]') as HTMLElement;
    select(fixture, 'research');

    const event: KeyboardEvent = press(listbox, 'End', { altKey: true });
    fixture.detectChanges();

    expect(event.defaultPrevented).toBe(true);
    expect(values(fixture)).toEqual(['prototype', 'review', 'release', 'research']);
  });

  it('never selects or moves disabled items', (): void => {
    const fixture: ComponentFixture<OrderListHost> = render(OrderListHost);
    select(fixture, 'review');

    expect(query(fixture, '[data-item="review"]').getAttribute('data-selected')).toBe('false');
    const moveUp: HTMLButtonElement = query(fixture, '[aria-label="Move selected items up"]') as HTMLButtonElement;
    expect(moveUp.getAttribute('aria-disabled')).toBe('true');
    expect(values(fixture)).toEqual(['research', 'prototype', 'review', 'release']);
  });
});

describe('OrderList disabled and validation state', (): void => {
  it('stays focusable while disabled and blocks reordering', (): void => {
    const fixture: ComponentFixture<OrderListHost> = render(OrderListHost);
    const listbox: HTMLElement = query(fixture, '[role="listbox"]') as HTMLElement;
    select(fixture, 'prototype');
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();

    fixture.componentInstance.control().focus();
    press(listbox, 'ArrowUp', { altKey: true });
    fixture.detectChanges();

    expect(document.activeElement).toBe(listbox);
    expect(listbox.getAttribute('aria-disabled')).toBe('true');
    expect(values(fixture)).toEqual(['research', 'prototype', 'review', 'release']);
  });

  it('delays invalid semantics until the control is touched', (): void => {
    const fixture: ComponentFixture<OrderListHost> = render(OrderListHost);
    const listbox: Element = query(fixture, '[role="listbox"]');
    fixture.componentInstance.invalid.set(true);
    fixture.detectChanges();
    expect(listbox.hasAttribute('aria-invalid')).toBe(false);

    fixture.componentInstance.touched.set(true);
    fixture.detectChanges();
    expect(listbox.getAttribute('aria-invalid')).toBe('true');
  });
});
