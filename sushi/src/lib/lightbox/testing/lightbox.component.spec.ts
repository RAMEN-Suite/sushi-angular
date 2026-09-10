import { Component, signal, WritableSignal } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { render } from '../../../../testing/test-utils';
import { GalleryImage } from '../../gallery';
import { Lightbox } from '../lightbox.component';

@Component({ imports: [Lightbox], template: `<sui-lightbox [image]="image" [(open)]="open" />` })
class Host {
  public readonly open: WritableSignal<boolean> = signal(false);
  public readonly image: GalleryImage = { value: 'a', src: 'a.jpg', width: 800, height: 600, alt: 'A' };
}

describe('Lightbox', (): void => {
  it('opens the configured image', (): void => {
    const fixture: ComponentFixture<Host> = render(Host);
    const instance: Lightbox = fixture.debugElement.children[0].componentInstance as Lightbox;
    instance.show();
    expect(fixture.componentInstance.open()).toBe(true);
  });
});
