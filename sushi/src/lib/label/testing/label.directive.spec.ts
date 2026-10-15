import { Component, signal, type WritableSignal } from '@angular/core';
import { type ComponentFixture } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { query, render } from '../../../../testing/test-utils';
import { Label } from '../label.directive';

@Component({
  imports: [Label],
  template: `<label suiLabel [floating]="floating()" for="name">Name</label><input id="name" />`,
})
class LabelHost {
  public readonly floating: WritableSignal<boolean> = signal<boolean>(false);
}

describe('Label', (): void => {
  it('replaces standard label styling when floating is enabled', (): void => {
    const fixture: ComponentFixture<LabelHost> = render(LabelHost);
    const label: HTMLLabelElement = query(fixture, 'label');

    expect(label.classList).toContain('sui-label');
    expect(label.classList).toContain('label');

    fixture.componentInstance.floating.set(true);
    fixture.detectChanges();

    expect(label.classList).toContain('floating-label');
    expect(label.classList).not.toContain('label');
  });
});
