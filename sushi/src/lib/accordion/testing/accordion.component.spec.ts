import { Component, signal, type Signal, viewChild, type WritableSignal } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { press, query, queryAll, render, requireItem } from '../../../../testing/test-utils';
import { AccordionItem } from '../accordion-item.directive';
import { Accordion } from '../accordion.component';
import type { AccordionValue } from '../accordion.interfaces';
import { AccordionHeaderTemplate, AccordionIndicatorTemplate } from '../accordion.templates';

@Component({
  imports: [Accordion, AccordionHeaderTemplate, AccordionIndicatorTemplate, AccordionItem],
  template: `
    <sui-accordion [disabled]="disabled()" [multiple]="multiple()" [wrap]="wrap()" [(value)]="value">
      <ng-template suiAccordionHeader let-item let-expanded="expanded">
        <span [attr.data-header]="item.value" [attr.data-expanded]="expanded">{{ item.label }}</span>
      </ng-template>
      <ng-template suiAccordionIndicator let-item><span [attr.data-indicator]="item.value">Toggle</span></ng-template>
      <ng-template suiAccordionItem value="ingredients" label="Ingredients">Broth and noodles</ng-template>
      <ng-template suiAccordionItem value="method" label="Method">Cook carefully</ng-template>
      <ng-template suiAccordionItem value="notes" label="Notes" disabled>Unavailable notes</ng-template>
    </sui-accordion>
  `,
})
class AccordionHost {
  public readonly control: Signal<Accordion> = viewChild.required(Accordion);
  public readonly disabled: WritableSignal<boolean> = signal<boolean>(false);
  public readonly multiple: WritableSignal<boolean> = signal<boolean>(false);
  public readonly wrap: WritableSignal<boolean> = signal<boolean>(true);
  public readonly value: WritableSignal<readonly AccordionValue[]> = signal<readonly AccordionValue[]>([]);
}

@Component({
  imports: [Accordion, AccordionItem],
  template: `
    <sui-accordion [(value)]="value">
      <ng-template suiAccordionItem value="settings" label="Settings">
        <button type="button">Save</button>
        <input aria-label="Name" />
      </ng-template>
    </sui-accordion>
  `,
})
class InteractiveAccordionHost {
  public readonly value: WritableSignal<readonly AccordionValue[]> = signal<readonly AccordionValue[]>([]);
}

describe('Accordion rendering and model', (): void => {
  it('renders semantic triggers and typed header contexts', (): void => {
    const fixture: ComponentFixture<AccordionHost> = render(AccordionHost);
    const buttons: readonly HTMLButtonElement[] = queryAll(fixture, 'button');

    expect(buttons).toHaveLength(3);
    expect(requireItem(buttons, 0).getAttribute('aria-expanded')).toBe('false');
    expect(requireItem(buttons, 2).getAttribute('aria-disabled')).toBe('true');
    expect(query(fixture, '[data-header="ingredients"]').getAttribute('data-expanded')).toBe('false');
    expect(query(fixture, '[data-indicator="method"]').textContent).toBe('Toggle');
  });

  it('expands one item at a time in single mode', (): void => {
    const fixture: ComponentFixture<AccordionHost> = render(AccordionHost);
    const buttons: readonly HTMLButtonElement[] = queryAll(fixture, 'button');
    requireItem(buttons, 0).click();
    fixture.detectChanges();

    expect(fixture.componentInstance.value()).toEqual(['ingredients']);
    expect(query(fixture, '[data-header="ingredients"]').getAttribute('data-expanded')).toBe('true');
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Broth and noodles');

    requireItem(buttons, 1).click();
    fixture.detectChanges();

    expect(fixture.componentInstance.value()).toEqual(['method']);
    expect(requireItem(buttons, 0).getAttribute('aria-expanded')).toBe('false');
    expect(requireItem(buttons, 1).getAttribute('aria-expanded')).toBe('true');
  });
});

describe('Accordion default indicator', (): void => {
  it('points the default indicator up for an initially expanded item and follows subsequent toggles', (): void => {
    const fixture: ComponentFixture<InteractiveAccordionHost> = TestBed.createComponent(InteractiveAccordionHost);
    fixture.componentInstance.value.set(['settings']);
    fixture.detectChanges();

    const trigger: HTMLButtonElement = query(fixture, 'button');
    const indicator: Element = query(fixture, 'button svg');
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(indicator.classList.contains('rotate-180')).toBe(true);

    trigger.click();
    fixture.detectChanges();

    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(indicator.classList.contains('rotate-180')).toBe(false);

    trigger.click();
    fixture.detectChanges();

    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(indicator.classList.contains('rotate-180')).toBe(true);
  });
});

describe('Accordion public controls', (): void => {
  it('expands enabled items and collapses the collection in multiple mode', (): void => {
    const fixture: ComponentFixture<AccordionHost> = render(AccordionHost);
    fixture.componentInstance.multiple.set(true);
    fixture.detectChanges();
    fixture.componentInstance.control().expandAll();
    fixture.detectChanges();

    expect(fixture.componentInstance.value()).toEqual(['ingredients', 'method']);

    fixture.componentInstance.control().collapseAll();
    fixture.detectChanges();

    expect(fixture.componentInstance.value()).toEqual([]);
  });

  it('does not expand all when multiple mode is unavailable', (): void => {
    const fixture: ComponentFixture<AccordionHost> = render(AccordionHost);
    fixture.componentInstance.control().expandAll();

    expect(fixture.componentInstance.value()).toEqual([]);
  });
});

describe('Accordion keyboard and disabled behavior', (): void => {
  it('moves focus between triggers with Angular Aria keyboard navigation', (): void => {
    const fixture: ComponentFixture<AccordionHost> = render(AccordionHost);
    const buttons: readonly HTMLButtonElement[] = queryAll(fixture, 'button');
    requireItem(buttons, 0).focus();
    press(requireItem(buttons, 0), 'ArrowDown');

    expect(document.activeElement).toBe(requireItem(buttons, 1));

    press(requireItem(buttons, 1), 'Enter');
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toEqual(['method']);

    press(requireItem(buttons, 1), ' ');
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toEqual([]);
  });

  it('keeps disabled triggers focusable without expanding them', (): void => {
    const fixture: ComponentFixture<AccordionHost> = render(AccordionHost);
    const buttons: readonly HTMLButtonElement[] = queryAll(fixture, 'button');
    requireItem(buttons, 2).focus();
    requireItem(buttons, 2).click();

    expect(document.activeElement).toBe(requireItem(buttons, 2));
    expect(fixture.componentInstance.value()).toEqual([]);
  });

  it('blocks the complete group when disabled', (): void => {
    const fixture: ComponentFixture<AccordionHost> = render(AccordionHost);
    const first: HTMLButtonElement = requireItem(queryAll(fixture, 'button'), 0);
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();
    first.click();

    expect(fixture.componentInstance.value()).toEqual([]);
    expect(first.getAttribute('aria-disabled')).toBe('true');
  });
});

describe('Accordion panel controls', (): void => {
  it('leaves panel keys to their controls without toggling or moving header focus', (): void => {
    const fixture: ComponentFixture<InteractiveAccordionHost> = render(InteractiveAccordionHost);
    const header: HTMLButtonElement = query(fixture, 'button');
    header.focus();
    header.click();
    fixture.detectChanges();

    const controls: readonly Element[] = queryAll(fixture, '[role="region"] button, [role="region"] input');
    expect(controls).toHaveLength(2);

    for (const control of controls) {
      (control as HTMLElement).focus();
      for (const key of ['Enter', ' ', 'ArrowUp', 'ArrowDown', 'Home', 'End']) {
        const event: KeyboardEvent = press(control, key);
        fixture.detectChanges();

        expect(event.defaultPrevented).toBe(false);
        expect(fixture.componentInstance.value()).toEqual(['settings']);
        expect(document.activeElement).toBe(control);
      }
    }
  });
});
