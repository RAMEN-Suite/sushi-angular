import { Component, signal, type Signal, viewChild, type WritableSignal } from '@angular/core';
import { type ComponentFixture } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import { press, query, queryAll, render } from '../../../../testing/test-utils';
import { OrderList } from '../order-list.component';
import {
  type OrderListLabels,
  type OrderListOption,
  type OrderListReorderEvent,
  type OrderListValue,
} from '../order-list.interfaces';
import { OrderListItemTemplate } from '../order-list.templates';

const items: readonly OrderListOption[] = Object.freeze([
  { label: 'Task', value: 'first' },
  { label: 'Task', value: 'second' },
  { label: 'Locked', value: 'locked', disabled: true },
  { label: 'Release', value: 'last' },
]);

@Component({
  imports: [OrderList, OrderListItemTemplate],
  template: `
    <sui-order-list
      ariaLabel="Workflow"
      [disabled]="disabled()"
      [reorderable]="reorderable()"
      [dragDrop]="dragDrop()"
      [labels]="labels()"
      [invalid]="invalid()"
      [touched]="touched()"
      [(value)]="value"
      (reordered)="events.push($event)"
      (touch)="touches += 1"
    >
      <ng-template [suiOrderListItem]="value()" let-item>
        <button type="button" [attr.data-item]="item.value" (click)="activations += 1">{{ item.label }}</button>
        <input [attr.aria-label]="'Note ' + item.value" [value]="item.value" />
      </ng-template>
    </sui-order-list>
  `,
})
class Host {
  public readonly control: Signal<OrderList> = viewChild.required(OrderList);
  public readonly value: WritableSignal<readonly OrderListOption[]> = signal(items);
  public readonly disabled: WritableSignal<boolean> = signal(false);
  public readonly reorderable: WritableSignal<boolean> = signal(true);
  public readonly dragDrop: WritableSignal<boolean> = signal(true);
  public readonly labels: WritableSignal<Partial<OrderListLabels>> = signal({});
  public readonly invalid: WritableSignal<boolean> = signal(false);
  public readonly touched: WritableSignal<boolean> = signal(false);
  public touches: number = 0;
  public readonly events: OrderListReorderEvent[] = [];
  public activations: number = 0;
}

function handle(fixture: ComponentFixture<Host>, value: string): HTMLButtonElement {
  const content: Element = query(fixture, `[data-item="${value}"]`);
  const button: HTMLButtonElement | null = content.closest('li')?.querySelector('button[aria-haspopup="menu"]') ?? null;
  if (!button) throw new Error('Expected a movement handle beside the item content.');
  return button;
}

function order(fixture: ComponentFixture<Host>): readonly OrderListValue[] {
  return fixture.componentInstance.value().map((item: OrderListOption): OrderListValue => item.value);
}

async function menu(fixture: ComponentFixture<Host>, value: string): Promise<readonly HTMLElement[]> {
  handle(fixture, value).click();
  await fixture.whenStable();
  return [...document.querySelectorAll<HTMLElement>('[role="menuitem"]')];
}

afterEach((): void => document.querySelectorAll('.cdk-overlay-container').forEach((element: Element): void => element.remove()));

describe('OrderList rendering and form state', (): void => {
  it('renders a named native list with independent controls and no selection widget', (): void => {
    const fixture: ComponentFixture<Host> = render(Host);
    expect(query(fixture, 'ol').getAttribute('aria-label')).toBe('Workflow');
    expect(queryAll(fixture, '[role="option"], [role="listbox"]')).toHaveLength(0);
    query(fixture, '[data-item="first"]').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(fixture.componentInstance.activations).toBe(1);
    expect(fixture.componentInstance.events).toEqual([]);
    expect(order(fixture)).toEqual(['first', 'second', 'locked', 'last']);
  });

  it('renders external changes and focuses an empty list with translated empty text', (): void => {
    const fixture: ComponentFixture<Host> = render(Host);
    fixture.componentInstance.value.set([...items].reverse());
    fixture.detectChanges();
    expect(queryAll(fixture, '[data-item]')[0]?.getAttribute('data-item')).toBe('last');
    fixture.componentInstance.value.set([]);
    fixture.componentInstance.labels.set({ empty: 'Keine Einträge' });
    fixture.detectChanges();
    fixture.componentInstance.control().focus();
    expect(query(fixture, 'ol').textContent).toContain('Keine Einträge');
    expect(document.activeElement).toBe(query(fixture, 'ol'));
  });

  it('reports interactions and reveals invalid state after touch', (): void => {
    const fixture: ComponentFixture<Host> = render(Host);
    fixture.componentInstance.invalid.set(true);
    fixture.detectChanges();
    expect(query(fixture, 'ol').hasAttribute('aria-invalid')).toBe(false);

    fixture.componentInstance.touched.set(true);
    fixture.detectChanges();
    expect(query(fixture, 'ol').getAttribute('aria-invalid')).toBe('true');
    press(handle(fixture, 'second'), 'ArrowDown', { altKey: true });
    expect(fixture.componentInstance.touches).toBeGreaterThan(0);
  });
});

describe('OrderList keyboard movement', (): void => {
  it('moves repeatedly by stable identity without mutating input or losing row state and focus', (): void => {
    const fixture: ComponentFixture<Host> = render(Host);
    const target: HTMLButtonElement = handle(fixture, 'first');
    const note: HTMLInputElement = query(fixture, 'input');
    note.value = 'Uncommitted note';
    target.focus();
    press(target, 'ArrowDown', { altKey: true });
    fixture.detectChanges();
    press(target, 'ArrowDown', { altKey: true });
    fixture.detectChanges();

    expect(order(fixture)).toEqual(['second', 'locked', 'first', 'last']);
    expect(items[0]?.value).toBe('first');
    expect(document.activeElement).toBe(target);
    expect(query(fixture, '[aria-label="Note first"]')).toBe(note);
    expect(note.value).toBe('Uncommitted note');
    expect(fixture.componentInstance.events.at(-1)).toMatchObject({ previousIndex: 1, currentIndex: 2 });
  });

  it.each([
    { firstKey: 'Home', lastKey: 'End', shiftKey: false },
    { firstKey: 'ArrowUp', lastKey: 'ArrowDown', shiftKey: true },
  ])('supports $firstKey/$lastKey boundaries and ignores unavailable moves', ({ firstKey, lastKey, shiftKey }): void => {
    const fixture: ComponentFixture<Host> = render(Host);
    const target: HTMLButtonElement = handle(fixture, 'second');
    press(target, 'ArrowDown');
    expect(fixture.componentInstance.events).toEqual([]);
    press(target, firstKey, { altKey: true, shiftKey });
    fixture.detectChanges();
    expect(order(fixture)[0]).toBe('second');
    press(target, 'ArrowUp', { altKey: true });
    expect(fixture.componentInstance.events).toHaveLength(1);
    press(target, lastKey, { altKey: true, shiftKey });
    fixture.detectChanges();
    expect(order(fixture).at(-1)).toBe('second');
    expect(document.activeElement).toBe(target);
  });
});

describe('OrderList movement menu', (): void => {
  it('exposes boundary states and moves with localised labels and announcements', async (): Promise<void> => {
    const fixture: ComponentFixture<Host> = render(Host);
    fixture.componentInstance.labels.set({
      moveDown: 'Nach unten',
      moved: (event): string => `Position ${event.currentIndex + 1}`,
    });
    fixture.detectChanges();
    const actions: readonly HTMLElement[] = await menu(fixture, 'first');
    expect(actions[0]?.getAttribute('aria-disabled')).toBe('true');
    const down: HTMLElement | undefined = actions.find(
      (action: HTMLElement): boolean => action.textContent.trim() === 'Nach unten',
    );
    if (!down) throw new Error('Expected the translated movement action.');
    down.click();
    await fixture.whenStable();

    expect(order(fixture)).toEqual(['second', 'first', 'locked', 'last']);
    expect(query(fixture, '[role="status"]').textContent).toContain('Position 2');
    expect(document.activeElement).toBe(handle(fixture, 'first'));
  });
});

describe('OrderList permissions', (): void => {
  it('blocks direct moves of disabled items while allowing other items to cross them', (): void => {
    const fixture: ComponentFixture<Host> = render(Host);
    press(handle(fixture, 'locked'), 'Home', { altKey: true });
    expect(fixture.componentInstance.events).toEqual([]);
    press(handle(fixture, 'last'), 'ArrowUp', { altKey: true });
    fixture.detectChanges();
    expect(order(fixture)).toEqual(['first', 'second', 'last', 'locked']);
  });

  it('keeps content usable with sorting off and supports keyboard moves with pointer dragging off', (): void => {
    const fixture: ComponentFixture<Host> = render(Host);
    fixture.componentInstance.reorderable.set(false);
    fixture.detectChanges();
    query(fixture, '[data-item="first"]').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    press(handle(fixture, 'first'), 'End', { altKey: true });
    expect(fixture.componentInstance.activations).toBe(1);
    expect(fixture.componentInstance.events).toEqual([]);
    fixture.componentInstance.reorderable.set(true);
    fixture.componentInstance.dragDrop.set(false);
    fixture.detectChanges();
    press(handle(fixture, 'first'), 'End', { altKey: true });
    fixture.detectChanges();
    expect(order(fixture).at(-1)).toBe('first');
  });

  it('makes custom content inert and closes a menu when movement is revoked', async (): Promise<void> => {
    const fixture: ComponentFixture<Host> = render(Host);
    await menu(fixture, 'first');
    fixture.componentInstance.disabled.set(true);
    await fixture.whenStable();
    expect(query(fixture, 'ol').hasAttribute('inert')).toBe(true);
    expect(document.querySelector('[role="menu"]')).toBeNull();
    press(handle(fixture, 'first'), 'End', { altKey: true });
    expect(fixture.componentInstance.events).toEqual([]);
  });
});
