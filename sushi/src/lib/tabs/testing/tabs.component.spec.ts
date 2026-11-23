import { Component, signal, type WritableSignal } from '@angular/core';
import { type ComponentFixture } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { press, query, queryAll, render, requireItem } from '../../../../testing/test-utils';
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
      [(value)]="value"
    >
      <ng-template suiTab value="overview" label="Overview"><p data-panel="overview">Summary</p></ng-template>
      <ng-template suiTab value="history" label="History" disabled><p data-panel="history">Archive</p></ng-template>
      <ng-template suiTab value="steps" label="Steps" preserveContent><p data-panel="steps">Instructions</p></ng-template>
    </sui-tabs>
  `,
})
class TabsHost {
  public readonly ariaLabelledby: WritableSignal<string | null> = signal<string | null>(null);
  public readonly disabled: WritableSignal<boolean> = signal<boolean>(false);
  public readonly value: WritableSignal<TabsValue> = signal<TabsValue>('overview');
}

@Component({
  imports: [Tab, Tabs],
  template: `
    <sui-tabs
      ariaLabel="Sections"
      [orientation]="orientation()"
      [selectionMode]="selectionMode()"
      [softDisabled]="softDisabled()"
      [wrap]="wrap()"
      [(value)]="value"
    >
      <ng-template suiTab value="a" label="A">Section A</ng-template>
      <ng-template suiTab value="b" label="B">Section B</ng-template>
      <ng-template suiTab value="c" label="C" disabled>Section C</ng-template>
      <ng-template suiTab value="d" label="D">Section D</ng-template>
    </sui-tabs>
  `,
})
class NavigationHost {
  public readonly orientation: WritableSignal<TabsOrientation> = signal<TabsOrientation>('horizontal');
  public readonly selectionMode: WritableSignal<TabsSelectionMode> = signal<TabsSelectionMode>('follow');
  public readonly softDisabled: WritableSignal<boolean> = signal<boolean>(false);
  public readonly value: WritableSignal<TabsValue> = signal<TabsValue>('a');
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
    expect(requireItem(tabs, 0).getAttribute('aria-selected')).toBe('true');
    expect(requireItem(tabs, 1).getAttribute('aria-disabled')).toBe('true');

    const panels: readonly Element[] = queryAll(fixture, '[role="tabpanel"]');

    expect(panels).toHaveLength(3);

    tabs.forEach((tab: Element, index: number): void => {
      expect(tab.getAttribute('aria-controls')).toBe(requireItem(panels, index).id);
      expect(requireItem(panels, index).getAttribute('aria-labelledby')).toBe(tab.id);
    });

    expect(query(fixture, '[data-panel="overview"]').textContent).toBe('Summary');
  });

  it('activates an enabled tab through pointer selection', (): void => {
    const fixture: ComponentFixture<TabsHost> = render(TabsHost);
    const tabs: readonly HTMLButtonElement[] = queryAll(fixture, 'button');
    requireItem(tabs, 2).click();
    fixture.detectChanges();

    expect(fixture.componentInstance.value()).toBe('steps');
    expect(requireItem(tabs, 2).getAttribute('aria-selected')).toBe('true');
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
  it('destroys inactive content by default and preserves it in an inactive panel on request', (): void => {
    const fixture: ComponentFixture<TabsHost> = render(TabsHost);
    const host: HTMLElement = fixture.nativeElement as HTMLElement;
    const tabs: readonly HTMLButtonElement[] = queryAll(fixture, 'button');
    requireItem(tabs, 2).click();
    fixture.detectChanges();

    expect(host.querySelector('[data-panel="overview"]')).toBeNull();

    const stepsContent: Element = query(fixture, '[data-panel="steps"]');
    const stepsPanel: Element = requireItem(queryAll(fixture, '[role="tabpanel"]'), 2);

    expect(stepsPanel.hasAttribute('inert')).toBe(false);

    requireItem(tabs, 0).click();
    fixture.detectChanges();

    expect(host.querySelector('[data-panel="steps"]')).toBe(stepsContent);
    expect(stepsPanel.hasAttribute('inert')).toBe(true);
  });
});

describe('Tabs selection mode', (): void => {
  it('follows horizontal arrow focus in follow mode', (): void => {
    const fixture: ComponentFixture<NavigationHost> = render(NavigationHost);
    const tabs: readonly HTMLButtonElement[] = queryAll(fixture, 'button');
    requireItem(tabs, 0).focus();
    press(requireItem(tabs, 0), 'ArrowRight');
    fixture.detectChanges();

    expect(document.activeElement).toBe(requireItem(tabs, 1));
    expect(fixture.componentInstance.value()).toBe('b');

    press(requireItem(tabs, 1), 'ArrowLeft');
    fixture.detectChanges();

    expect(document.activeElement).toBe(requireItem(tabs, 0));
    expect(fixture.componentInstance.value()).toBe('a');
  });

  it('waits for explicit activation in explicit mode', (): void => {
    const fixture: ComponentFixture<NavigationHost> = render(NavigationHost);
    const tabs: readonly HTMLButtonElement[] = queryAll(fixture, 'button');
    fixture.componentInstance.selectionMode.set('explicit');
    fixture.detectChanges();
    requireItem(tabs, 0).focus();
    press(requireItem(tabs, 0), 'ArrowRight');

    expect(document.activeElement).toBe(requireItem(tabs, 1));
    expect(fixture.componentInstance.value()).toBe('a');

    press(requireItem(tabs, 1), 'Enter');
    fixture.detectChanges();

    expect(fixture.componentInstance.value()).toBe('b');
  });
});

describe('Tabs orientation', (): void => {
  it('uses vertical arrows when orientation changes', (): void => {
    const fixture: ComponentFixture<NavigationHost> = render(NavigationHost);
    const tabs: readonly HTMLButtonElement[] = queryAll(fixture, 'button');
    fixture.componentInstance.orientation.set('vertical');
    fixture.detectChanges();
    requireItem(tabs, 0).focus();
    press(requireItem(tabs, 0), 'ArrowDown');
    fixture.detectChanges();

    expect(document.activeElement).toBe(requireItem(tabs, 1));
    expect(fixture.componentInstance.value()).toBe('b');
    expect(query(fixture, '[role="tablist"]').getAttribute('aria-orientation')).toBe('vertical');

    press(requireItem(tabs, 1), 'ArrowRight');
    fixture.detectChanges();

    expect(document.activeElement).toBe(requireItem(tabs, 1));
    expect(fixture.componentInstance.value()).toBe('b');
  });
});

describe('Tabs navigation defaults', (): void => {
  it('wraps from the last tab to the first by default', (): void => {
    const fixture: ComponentFixture<TabsHost> = render(TabsHost);
    const tabs: readonly HTMLButtonElement[] = queryAll(fixture, 'button');
    fixture.componentInstance.value.set('steps');
    fixture.detectChanges();
    requireItem(tabs, 2).focus();
    press(requireItem(tabs, 2), 'ArrowRight');
    fixture.detectChanges();

    expect(document.activeElement).toBe(requireItem(tabs, 0));
    expect(fixture.componentInstance.value()).toBe('overview');
  });

  it('hard-disables items by default', (): void => {
    const fixture: ComponentFixture<TabsHost> = render(TabsHost);
    const tabs: readonly HTMLButtonElement[] = queryAll(fixture, 'button');

    expect(requireItem(tabs, 1).getAttribute('aria-disabled')).toBe('true');

    requireItem(tabs, 0).focus();
    press(requireItem(tabs, 0), 'ArrowRight');
    fixture.detectChanges();

    expect(document.activeElement).toBe(requireItem(tabs, 2));
    expect(fixture.componentInstance.value()).toBe('steps');

    requireItem(tabs, 1).click();

    expect(fixture.componentInstance.value()).toBe('steps');
  });
});

describe('Tabs navigation boundaries', (): void => {
  it('wraps from the last to the first tab and back when enabled', (): void => {
    const fixture: ComponentFixture<NavigationHost> = render(NavigationHost);
    const tabs: readonly HTMLButtonElement[] = queryAll(fixture, 'button');
    fixture.componentInstance.value.set('d');
    fixture.detectChanges();
    requireItem(tabs, 3).focus();
    press(requireItem(tabs, 3), 'ArrowRight');
    fixture.detectChanges();

    expect(document.activeElement).toBe(requireItem(tabs, 0));
    expect(fixture.componentInstance.value()).toBe('a');

    press(requireItem(tabs, 0), 'ArrowLeft');
    fixture.detectChanges();

    expect(document.activeElement).toBe(requireItem(tabs, 3));
    expect(fixture.componentInstance.value()).toBe('d');
  });

  it('navigates past disabled tabs but stops at the last tab when wrapping is disabled', (): void => {
    const fixture: ComponentFixture<NavigationHost> = render(NavigationHost);
    fixture.componentInstance.wrap.set(false);
    fixture.componentInstance.value.set('b');
    fixture.detectChanges();
    const tabs: readonly HTMLButtonElement[] = queryAll(fixture, 'button');
    requireItem(tabs, 1).focus();
    press(requireItem(tabs, 1), 'ArrowRight');
    fixture.detectChanges();

    expect(document.activeElement).toBe(requireItem(tabs, 3));
    expect(fixture.componentInstance.value()).toBe('d');

    press(requireItem(tabs, 3), 'ArrowRight');
    fixture.detectChanges();

    expect(document.activeElement).toBe(requireItem(tabs, 3));
    expect(fixture.componentInstance.value()).toBe('d');
  });
});

describe('Tabs disabled behavior', (): void => {
  it('supports discoverable soft-disabled tabs as an opt-in', (): void => {
    const fixture: ComponentFixture<NavigationHost> = render(NavigationHost);
    const tabs: readonly HTMLButtonElement[] = queryAll(fixture, 'button');
    fixture.componentInstance.softDisabled.set(true);
    fixture.componentInstance.value.set('b');
    fixture.detectChanges();
    requireItem(tabs, 1).focus();
    press(requireItem(tabs, 1), 'ArrowRight');
    fixture.detectChanges();

    expect(document.activeElement).toBe(requireItem(tabs, 2));
    expect(requireItem(tabs, 2).getAttribute('aria-disabled')).toBe('true');
    expect(fixture.componentInstance.value()).toBe('b');

    requireItem(tabs, 2).click();

    expect(fixture.componentInstance.value()).toBe('b');
  });

  it('blocks activation for a disabled tab set', (): void => {
    const fixture: ComponentFixture<TabsHost> = render(TabsHost);
    const tabs: readonly HTMLButtonElement[] = queryAll(fixture, 'button');
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();
    requireItem(tabs, 2).click();

    expect(fixture.componentInstance.value()).toBe('overview');
    expect(query(fixture, '[role="tablist"]').getAttribute('aria-disabled')).toBe('true');
    expect(tabs.every((tab: HTMLButtonElement): boolean => tab.getAttribute('aria-disabled') === 'true')).toBe(true);
  });
});
