import { Component, signal, WritableSignal } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { press, query, queryAll, render } from '../../../../testing/test-utils';
import { Tab } from '../tab.directive';
import { Tabs } from '../tabs.component';
import type { TabsFocusMode, TabsOrientation, TabsSelectionMode, TabsValue } from '../tabs.interfaces';

@Component({
  imports: [Tab, Tabs],
  template: `
    <sui-tabs
      ariaLabel="Recipe sections"
      [disabled]="disabled()"
      [focusMode]="focusMode()"
      [orientation]="orientation()"
      [selectionMode]="selectionMode()"
      [(value)]="value"
    >
      <ng-template suiTab value="overview" label="Overview"><p data-panel="overview">Summary</p></ng-template>
      <ng-template suiTab value="steps" label="Steps"><p data-panel="steps">Instructions</p></ng-template>
      <ng-template suiTab value="history" label="History" disabled><p data-panel="history">Archive</p></ng-template>
    </sui-tabs>
  `,
})
class TabsHost {
  public readonly disabled: WritableSignal<boolean> = signal<boolean>(false);
  public readonly focusMode: WritableSignal<TabsFocusMode> = signal<TabsFocusMode>('roving');
  public readonly orientation: WritableSignal<TabsOrientation> = signal<TabsOrientation>('horizontal');
  public readonly selectionMode: WritableSignal<TabsSelectionMode> = signal<TabsSelectionMode>('follow');
  public readonly value: WritableSignal<TabsValue> = signal<TabsValue>('overview');
}

describe('Tabs semantics and model', (): void => {
  it('connects one labelled tab list with tabs and panels', (): void => {
    const fixture: ComponentFixture<TabsHost> = render(TabsHost);
    const list: Element = query(fixture, '[role="tablist"]');
    const tabs: readonly Element[] = queryAll(fixture, '[role="tab"]');

    expect(list.getAttribute('aria-label')).toBe('Recipe sections');
    expect(list.getAttribute('aria-orientation')).toBe('horizontal');
    expect(tabs).toHaveLength(3);
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
    expect(tabs[2].getAttribute('aria-disabled')).toBe('true');
    expect(queryAll(fixture, '[role="tabpanel"]')).toHaveLength(3);
    expect(query(fixture, '[data-panel="overview"]').textContent).toBe('Summary');
  });

  it('activates an enabled tab through pointer selection', (): void => {
    const fixture: ComponentFixture<TabsHost> = render(TabsHost);
    const tabs: readonly HTMLButtonElement[] = queryAll(fixture, 'button');
    tabs[1].click();
    fixture.detectChanges();

    expect(fixture.componentInstance.value()).toBe('steps');
    expect(tabs[1].getAttribute('aria-selected')).toBe('true');
    expect(query(fixture, '[data-panel="steps"]').textContent).toBe('Instructions');
  });
});

describe('Tabs keyboard behavior', (): void => {
  it('follows horizontal arrow focus in follow mode', (): void => {
    const fixture: ComponentFixture<TabsHost> = render(TabsHost);
    const tabs: readonly HTMLButtonElement[] = queryAll(fixture, 'button');
    tabs[0].focus();
    press(tabs[0], 'ArrowRight');
    fixture.detectChanges();

    expect(document.activeElement).toBe(tabs[1]);
    expect(fixture.componentInstance.value()).toBe('steps');
  });

  it('uses vertical arrows when orientation changes', (): void => {
    const fixture: ComponentFixture<TabsHost> = render(TabsHost);
    const tabs: readonly HTMLButtonElement[] = queryAll(fixture, 'button');
    fixture.componentInstance.orientation.set('vertical');
    fixture.detectChanges();
    tabs[0].focus();
    press(tabs[0], 'ArrowDown');
    fixture.detectChanges();

    expect(document.activeElement).toBe(tabs[1]);
    expect(fixture.componentInstance.value()).toBe('steps');
  });

  it('waits for explicit activation in explicit mode', (): void => {
    const fixture: ComponentFixture<TabsHost> = render(TabsHost);
    const tabs: readonly HTMLButtonElement[] = queryAll(fixture, 'button');
    fixture.componentInstance.selectionMode.set('explicit');
    fixture.detectChanges();
    tabs[0].focus();
    press(tabs[0], 'ArrowRight');
    expect(fixture.componentInstance.value()).toBe('overview');

    press(tabs[1], 'Enter');
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe('steps');
  });
});

describe('Tabs disabled behavior', (): void => {
  it('keeps an item-disabled tab focusable without activation', (): void => {
    const fixture: ComponentFixture<TabsHost> = render(TabsHost);
    const tabs: readonly HTMLButtonElement[] = queryAll(fixture, 'button');
    tabs[2].focus();
    tabs[2].click();

    expect(document.activeElement).toBe(tabs[2]);
    expect(fixture.componentInstance.value()).toBe('overview');
  });

  it('blocks activation for a disabled tab set', (): void => {
    const fixture: ComponentFixture<TabsHost> = render(TabsHost);
    const tabs: readonly HTMLButtonElement[] = queryAll(fixture, 'button');
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();
    tabs[1].click();

    expect(fixture.componentInstance.value()).toBe('overview');
    expect(query(fixture, '[role="tablist"]').getAttribute('aria-disabled')).toBe('true');
  });
});
