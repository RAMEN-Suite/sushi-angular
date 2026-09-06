import { Component, signal, Signal, viewChild, WritableSignal } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { press, query, queryAll, render } from '../../../../testing/test-utils';
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

describe('Accordion rendering and model', (): void => {
  it('renders semantic triggers and typed header contexts', (): void => {
    const fixture: ComponentFixture<AccordionHost> = render(AccordionHost);
    const buttons: readonly HTMLButtonElement[] = queryAll(fixture, 'button');

    expect(buttons).toHaveLength(3);
    expect(buttons[0].getAttribute('aria-expanded')).toBe('false');
    expect(buttons[2].getAttribute('aria-disabled')).toBe('true');
    expect(query(fixture, '[data-header="ingredients"]').getAttribute('data-expanded')).toBe('false');
    expect(query(fixture, '[data-indicator="method"]').textContent).toBe('Toggle');
  });

  it('expands one item at a time in single mode', (): void => {
    const fixture: ComponentFixture<AccordionHost> = render(AccordionHost);
    const buttons: readonly HTMLButtonElement[] = queryAll(fixture, 'button');
    buttons[0].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toEqual(['ingredients']);
    expect(query(fixture, '[data-header="ingredients"]').getAttribute('data-expanded')).toBe('true');
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Broth and noodles');

    buttons[1].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toEqual(['method']);
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
    buttons[0].focus();
    press(buttons[0], 'ArrowDown');
    expect(document.activeElement).toBe(buttons[1]);
  });

  it('keeps disabled triggers focusable without expanding them', (): void => {
    const fixture: ComponentFixture<AccordionHost> = render(AccordionHost);
    const buttons: readonly HTMLButtonElement[] = queryAll(fixture, 'button');
    buttons[2].focus();
    buttons[2].click();

    expect(document.activeElement).toBe(buttons[2]);
    expect(fixture.componentInstance.value()).toEqual([]);
  });

  it('blocks the complete group when disabled', (): void => {
    const fixture: ComponentFixture<AccordionHost> = render(AccordionHost);
    const first: HTMLButtonElement = queryAll(fixture, 'button')[0];
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();
    first.click();

    expect(fixture.componentInstance.value()).toEqual([]);
    expect(first.getAttribute('aria-disabled')).toBe('true');
  });
});
