import { Component, signal, WritableSignal } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { press, queryAll, render } from '../../../../testing/test-utils';
import { AccordionItem } from '../accordion-item.directive';
import { Accordion } from '../accordion.component';
import { AccordionValue } from '../accordion.interfaces';
import { AccordionActionsTemplate } from '../accordion.templates';

@Component({
  imports: [Accordion, AccordionItem, AccordionActionsTemplate],
  template: `
    <sui-accordion [(value)]="value">
      <ng-template suiAccordionActions let-item let-expanded="expanded">
        <button
          type="button"
          [attr.aria-label]="'Add ' + item.label"
          [disabled]="item.disabled"
          [attr.data-expanded]="expanded"
          (click)="added.set(item.value)"
        >
          Add
        </button>
      </ng-template>
      <ng-template suiAccordionItem value="bowls" label="Bowls">Rice bowls</ng-template>
      <ng-template suiAccordionItem value="desserts" label="Desserts" disabled>Sweet treats</ng-template>
    </sui-accordion>
  `,
})
class ActionsHost {
  public readonly value: WritableSignal<readonly AccordionValue[]> = signal([]);
  public readonly added: WritableSignal<string | null> = signal(null);
}

describe('Accordion sibling actions', (): void => {
  it('projects item and expansion state outside the trigger and heading', (): void => {
    const fixture: ComponentFixture<ActionsHost> = render(ActionsHost);
    const buttons: readonly HTMLButtonElement[] = queryAll(fixture, 'button');
    const action: HTMLButtonElement = buttons[1];

    expect(action.getAttribute('aria-label')).toBe('Add Bowls');
    expect(action.closest('h3')).toBeNull();
    expect(action.parentElement?.closest('button')).toBeNull();
    expect(action.getAttribute('data-expanded')).toBe('false');
    expect(buttons[3].disabled).toBe(true);

    action.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.added()).toBe('bowls');
    expect(fixture.componentInstance.value()).toEqual([]);

    buttons[0].click();
    fixture.detectChanges();

    expect(action.getAttribute('data-expanded')).toBe('true');
  });

  it('keeps native action keys from toggling or navigating the Accordion', (): void => {
    const fixture: ComponentFixture<ActionsHost> = render(ActionsHost);
    const action: HTMLButtonElement = queryAll(fixture, 'button')[1];
    action.focus();

    for (const key of ['Enter', ' ', 'ArrowDown', 'ArrowUp', 'Home', 'End']) {
      const event: KeyboardEvent = press(action, key);
      fixture.detectChanges();

      expect(event.defaultPrevented).toBe(false);
      expect(fixture.componentInstance.value()).toEqual([]);
      expect(document.activeElement).toBe(action);
    }
  });
});
