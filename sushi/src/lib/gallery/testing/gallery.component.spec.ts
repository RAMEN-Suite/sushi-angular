import { Component, signal, WritableSignal } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';
import { query, render } from '../../../../testing/test-utils';
import { Gallery, GalleryImage } from '../index';

@Component({
  imports: [Gallery],
  template: `<sui-gallery
    [images]="images()"
    [(activeIndex)]="active"
    [wrap]="wrap()"
    [fit]="fit()"
    (imageActivated)="activated.push($event)"
  />`,
})
class Host {
  public readonly activated: GalleryImage[] = [];
  public readonly active: WritableSignal<number> = signal(0);
  public readonly fit: WritableSignal<'contain' | 'cover'> = signal<'contain' | 'cover'>('cover');
  public readonly images: WritableSignal<readonly GalleryImage[]> = signal<readonly GalleryImage[]>([
    { value: 'a', src: 'a.jpg', width: 800, height: 600, alt: 'A' },
    { value: 'b', src: 'b.jpg', width: 800, height: 600, alt: 'B' },
  ]);
  public readonly wrap: WritableSignal<boolean> = signal(true);
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

  it('emits the selected image when its large preview is activated', (): void => {
    const fixture: ComponentFixture<Host> = render(Host);
    fixture.componentInstance.active.set(1);
    fixture.detectChanges();

    const image: HTMLButtonElement = query(fixture, '.sui-gallery__image') as HTMLButtonElement;
    image.click();

    expect(fixture.componentInstance.activated).toEqual([fixture.componentInstance.images()[1]]);
    expect(document.activeElement).toBe(image);
  });
});

describe('Gallery keyboard navigation', (): void => {
  it('supports keyboard navigation and optional wrapping', (): void => {
    const fixture: ComponentFixture<Host> = render(Host);
    const gallery: HTMLElement = query(fixture, '.sui-gallery') as HTMLElement;
    const thumbnails: readonly HTMLButtonElement[] = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLButtonElement>('.sui-gallery__thumbnails button'),
    );
    thumbnails[0].focus();

    gallery.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.active()).toBe(1);
    expect(document.activeElement).toBe(thumbnails[1]);
    expect(thumbnails.map((thumbnail: HTMLButtonElement): number => thumbnail.tabIndex)).toEqual([-1, 0]);

    fixture.componentInstance.wrap.set(false);
    fixture.detectChanges();
    gallery.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.active()).toBe(1);
  });
});

describe('Gallery states', (): void => {
  it('clamps an external index and exposes the selected fit mode', (): void => {
    const fixture: ComponentFixture<Host> = render(Host);
    fixture.componentInstance.active.set(20);
    fixture.componentInstance.fit.set('contain');
    fixture.detectChanges();

    expect((query(fixture, '.sui-gallery') as HTMLElement).dataset['fit']).toBe('contain');
    expect(query(fixture, '.sui-gallery__meta span').textContent.trim()).toBe('2 / 2');
    expect((query(fixture, '.sui-gallery__image img') as HTMLImageElement).alt).toBe('B');
  });

  it('keeps the active thumbnail visible when navigating a long collection', (): void => {
    const fixture: ComponentFixture<Host> = render(Host);
    const thumbnails: HTMLButtonElement[] = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLButtonElement>('.sui-gallery__thumbnails button'),
    );
    const scrollIntoView: (arg?: boolean | ScrollIntoViewOptions) => void = vi.fn();
    thumbnails[1].scrollIntoView = scrollIntoView;

    (query(fixture, '.sui-gallery__next') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
  });

  it('renders an empty state without image navigation', (): void => {
    const fixture: ComponentFixture<Host> = render(Host);
    fixture.componentInstance.images.set([]);
    fixture.detectChanges();

    expect(query(fixture, '.sui-gallery__empty').textContent).toContain('No images available');
    expect((fixture.nativeElement as HTMLElement).querySelector('.sui-gallery__next')).toBeNull();
    expect((fixture.nativeElement as HTMLElement).querySelector('.sui-gallery__thumbnails')).toBeNull();
  });
});
