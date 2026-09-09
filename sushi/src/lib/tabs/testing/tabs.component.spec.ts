import { Component, signal, WritableSignal } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { press, query, queryAll, render } from '../../../../testing/test-utils';
import { Tab } from '../tab.directive';
import { Tabs } from '../tabs.component';
import type { TabsOrientation, TabsSelectionMode, TabsValue } from '../tabs.interfaces';

@Component({
  imports: [Tab, Tabs],
  template: `
    <h2 id="section-heading">Recipe sections</h2>
    <sui-tabs
      [ariaLabel]="ariaLabelledby() ? null : 'Recipe sections'"
      [ariaLabelledby]="ariaLabelledby()"
      [disabled]="disabled()"
      [orientation]="orientation()"
      [selectionMode]="selectionMode()"
      [softDisabled]="softDisabled()"
      [wrap]="wrap()"
      [(value)]="value"
    >
      <ng-template suiTab value="overview" label="Overview"><p data-panel="overview">Summary</p></ng-template>
      <ng-template suiTab value="steps" label="Steps" preserveContent><p data-panel="steps">Instructions</p></ng-template>
      <ng-template suiTab value="history" label="History" disabled><p data-panel="history">Archive</p></ng-template>
    </sui-tabs>
  `,
})
class TabsHost {
  public readonly ariaLabelledby: WritableSignal<string | null> = signal<string | null>(null);
  public readonly disabled: WritableSignal<boolean> = signal<boolean>(false);
  public readonly orientation: WritableSignal<TabsOrientation> = signal<TabsOrientation>('horizontal');
  public readonly selectionMode: WritableSignal<TabsSelectionMode> = signal<TabsSelectionMode>('follow');
  public readonly softDisabled: WritableSignal<boolean> = signal<boolean>(false);
  public readonly value: WritableSignal<TabsValue> = signal<TabsValue>('overview');
  public readonly wrap: WritableSignal<boolean> = signal<boolean>(true);
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

  it('uses a visible label instead of a redundant aria-label', (): void => {
    const fixture: ComponentFixture<TabsHost> = render(TabsHost);
    fixture.componentInstance.ariaLabelledby.set('section-heading');
    fixture.detectChanges();
    const list: Element = query(fixture, '[role="tablist"]');

    expect(list.getAttribute('aria-label')).toBeNull();
    expect(list.getAttribute('aria-labelledby')).toBe('section-heading');
  });
});

describe('Tabs panel lifecycle', (): void => {
  it('destroys inactive content by default and preserves it on request', (): void => {
    const fixture: ComponentFixture<TabsHost> = render(TabsHost);
    const host: HTMLElement = fixture.nativeElement as HTMLElement;
    const tabs: readonly HTMLButtonElement[] = queryAll(fixture, 'button');
    tabs[1].click();
    fixture.detectChanges();

    expect(host.querySelector('[data-panel="overview"]')).toBeNull();
    tabs[0].click();
    fixture.detectChanges();
    expect(host.querySelector('[data-panel="steps"]')).not.toBeNull();
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

describe('Tabs navigation boundaries', (): void => {
  it('skips disabled tabs during arrow navigation', (): void => {
    const fixture: ComponentFixture<TabsHost> = render(TabsHost);
    const tabs: readonly HTMLButtonElement[] = queryAll(fixture, 'button');
    tabs[1].focus();
    press(tabs[1], 'ArrowRight');
    fixture.detectChanges();

    expect(document.activeElement).not.toBe(tabs[2]);
    expect(document.activeElement).toBe(tabs[1]);
    expect(fixture.componentInstance.value()).toBe('steps');
  });
});

describe('Tabs disabled behavior', (): void => {
  it('hard-disables an item by default', (): void => {
    const fixture: ComponentFixture<TabsHost> = render(TabsHost);
    const tabs: readonly HTMLButtonElement[] = queryAll(fixture, 'button');

    expect(tabs[2].getAttribute('aria-disabled')).toBe('true');
    expect(tabs[2].tabIndex).toBe(-1);
    tabs[2].click();
    expect(fixture.componentInstance.value()).toBe('overview');
  });

  it('supports discoverable soft-disabled tabs as an opt-in', (): void => {
    const fixture: ComponentFixture<TabsHost> = render(TabsHost);
    const tabs: readonly HTMLButtonElement[] = queryAll(fixture, 'button');
    fixture.componentInstance.softDisabled.set(true);
    fixture.detectChanges();
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
    expect(tabs.every((tab: HTMLButtonElement): boolean => tab.getAttribute('aria-disabled') === 'true')).toBe(true);
  });
});
