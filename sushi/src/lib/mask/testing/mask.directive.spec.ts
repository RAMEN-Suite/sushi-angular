import { Component, signal, WritableSignal } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { query, render } from '../../../../testing/test-utils';
import { Mask } from '../mask.directive';
import { MaskHalf, MaskShape } from '../mask.interfaces';

@Component({
  imports: [Mask],
  template: `<img alt="Sample" [suiMask]="shape()" [maskHalf]="maskHalf()" />`,
})
class MaskHost {
  public readonly shape: WritableSignal<MaskShape | null> = signal<MaskShape | null>('heart');
  public readonly maskHalf: WritableSignal<MaskHalf | null> = signal<MaskHalf | null>('first');
}

describe('Mask', (): void => {
  it('maps its shape and half to the mask primitive', (): void => {
    const fixture: ComponentFixture<MaskHost> = render(MaskHost);
    const image: HTMLImageElement = query(fixture, 'img');

    expect(image.classList).toContain('mask');
    expect(image.classList).toContain('mask-heart');
    expect(image.classList).toContain('mask-half-1');

    fixture.componentInstance.shape.set('hexagon-2');
    fixture.componentInstance.maskHalf.set('second');
    fixture.detectChanges();
    expect(image.classList).not.toContain('mask-heart');
    expect(image.classList).toContain('mask-hexagon-2');
    expect(image.classList).toContain('mask-half-2');
  });

  it('removes mask classes when disabled with null', (): void => {
    const fixture: ComponentFixture<MaskHost> = render(MaskHost);
    const image: HTMLImageElement = query(fixture, 'img');

    fixture.componentInstance.shape.set(null);
    fixture.detectChanges();
    expect(image.classList).not.toContain('mask');
    expect(image.classList).not.toContain('mask-half-1');
  });
});
