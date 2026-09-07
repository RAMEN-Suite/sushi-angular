import { Component, signal, WritableSignal } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { query, render } from '../../../../testing/test-utils';
import { FieldsetContent } from '../fieldset-content.directive';
import { FieldsetLegend } from '../fieldset-legend.directive';
import { FieldsetToggle } from '../fieldset-toggle.directive';
import { Fieldset } from '../fieldset.directive';

@Component({
  imports: [Fieldset, FieldsetContent, FieldsetLegend, FieldsetToggle],
  template: `
    <fieldset suiFieldset collapsible [bordered]="bordered()" [(expanded)]="expanded">
      <legend suiFieldsetLegend><button suiFieldsetToggle>Options</button></legend>
      <div suiFieldsetContent>Fields</div>
    </fieldset>
  `,
})
class FieldsetHost {
  public readonly bordered: WritableSignal<boolean> = signal<boolean>(true);
  public readonly expanded: WritableSignal<boolean> = signal<boolean>(true);
}

describe('Fieldset', (): void => {
  it('uses native fieldset semantics and exposes its expanded state', (): void => {
    const fixture: ComponentFixture<FieldsetHost> = render(FieldsetHost);
    expect(query(fixture, 'fieldset').classList).toContain('sui-fieldset--collapsible');
    expect(query(fixture, 'fieldset').classList).not.toContain('sui-fieldset--borderless');
    expect(query(fixture, 'legend').classList).toContain('fieldset-legend');
    expect(query(fixture, 'button').getAttribute('aria-expanded')).toBe('true');
  });

  it('allows consumers to remove the default visual frame', (): void => {
    const fixture: ComponentFixture<FieldsetHost> = render(FieldsetHost);
    fixture.componentInstance.bordered.set(false);
    fixture.detectChanges();

    expect(query(fixture, 'fieldset').classList).toContain('sui-fieldset--borderless');
  });

  it('collapses content and makes it inert through its toggle', (): void => {
    const fixture: ComponentFixture<FieldsetHost> = render(FieldsetHost);
    query(fixture, 'button').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();
    const content: Element = query(fixture, '[suiFieldsetContent]');
    expect(fixture.componentInstance.expanded()).toBe(false);
    expect(query(fixture, 'fieldset').classList).toContain('sui-fieldset--collapsed');
    expect(content.getAttribute('aria-hidden')).toBe('true');
    expect(content.hasAttribute('inert')).toBe(true);
  });
});
