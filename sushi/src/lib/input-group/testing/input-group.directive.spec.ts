import { Component, signal, WritableSignal } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { query, render } from '../../../../testing/test-utils';
import { InputGroupAddon } from '../input-group-addon.directive';
import { InputGroup, InputGroupOrientation } from '../input-group.directive';

@Component({
  imports: [InputGroup, InputGroupAddon],
  template: `<div suiInputGroup [orientation]="orientation()"><span suiInputGroupAddon>https://</span><input /></div>`,
})
class InputGroupHost {
  public readonly orientation: WritableSignal<InputGroupOrientation> = signal<InputGroupOrientation>('horizontal');
}

describe('InputGroup', (): void => {
  it('joins controls and non-interactive add-ons in the chosen direction', (): void => {
    const fixture: ComponentFixture<InputGroupHost> = render(InputGroupHost);
    const group: Element = query(fixture, '[suiInputGroup]');
    expect(group.classList).toContain('join-horizontal');
    expect(query(fixture, '[suiInputGroupAddon]').classList).toContain('pointer-events-none');
    fixture.componentInstance.orientation.set('responsive');
    fixture.detectChanges();
    expect(group.classList).toContain('sui-input-group--responsive');
    expect(group.classList).toContain('join-vertical');
  });
});
