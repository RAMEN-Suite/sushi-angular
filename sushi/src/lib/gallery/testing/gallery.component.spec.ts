import { Component, signal, WritableSignal } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { query, render } from '../../../../testing/test-utils';
import { Gallery, GalleryImage } from '../index';

@Component({ imports: [Gallery], template: `<sui-gallery [images]="images" [(activeIndex)]="active" />` })
class Host {
  public readonly active: WritableSignal<number> = signal(0);
  public readonly images: readonly GalleryImage[] = [
    { value: 'a', src: 'a.jpg', width: 800, height: 600, alt: 'A' },
    { value: 'b', src: 'b.jpg', width: 800, height: 600, alt: 'B' },
  ];
}

describe('Gallery', (): void => {
  it('updates the active image from thumbnail and navigation controls', (): void => {
    const fixture: ComponentFixture<Host> = render(Host);
    const thumbnails: readonly HTMLButtonElement[] = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLButtonElement>('.sui-gallery__thumbnails button'),
    );
    thumbnails[1].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.active()).toBe(1);
    expect((query(fixture, '.sui-gallery__image img') as HTMLImageElement).alt).toBe('B');

    (query(fixture, '.sui-gallery__next') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(fixture.componentInstance.active()).toBe(0);
  });
});
