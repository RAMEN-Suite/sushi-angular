import { Component, signal, type WritableSignal } from '@angular/core';
import { type ComponentFixture } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { press, query, render, requireItem } from '../../../../testing/test-utils';
import { Gallery, type GalleryImage } from '../index';

@Component({
  imports: [Gallery],
  template: `<sui-gallery
    [images]="images()"
    [(activeIndex)]="active"
    [wrap]="wrap()"
    [fit]="fit()"
    [showNavigation]="showNavigation()"
    [showThumbnails]="showThumbnails()"
    [showCounter]="showCounter()"
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
    { value: 'c', src: 'c.jpg', width: 800, height: 600, alt: 'C' },
  ]);
  public readonly showCounter: WritableSignal<boolean> = signal(true);
  public readonly showNavigation: WritableSignal<boolean> = signal(true);
  public readonly showThumbnails: WritableSignal<boolean> = signal(true);
  public readonly wrap: WritableSignal<boolean> = signal(true);
}

describe('Gallery selection', (): void => {
  it('selects thumbnails and navigates with distinct next and previous actions', (): void => {
    const fixture: ComponentFixture<Host> = render(Host);
    const thumbnails: readonly HTMLButtonElement[] = Array.from(
      query(fixture, '[role="group"][aria-label="Choose image"]').querySelectorAll('button'),
    );
    requireItem(thumbnails, 1).click();
    fixture.detectChanges();

    expect(fixture.componentInstance.active()).toBe(1);
    expect(requireItem(thumbnails, 1).getAttribute('aria-current')).toBe('true');
    expect(requireItem(thumbnails, 0).hasAttribute('aria-current')).toBe(false);
    expect(query(fixture, 'img[alt="B"]')).toBeTruthy();

    query(fixture, '[aria-label="Next image"]').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.active()).toBe(2);

    query(fixture, '[aria-label="Previous image"]').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.active()).toBe(1);
  });

  it('emits the selected image and focuses its activated preview', (): void => {
    const fixture: ComponentFixture<Host> = render(Host);
    fixture.componentInstance.active.set(1);
    fixture.detectChanges();
    const preview: HTMLButtonElement | null = query(fixture, 'img[alt="B"]').closest('button');
    if (preview === null) throw new Error('Expected the selected image inside a preview button.');

    expect(document.activeElement).not.toBe(preview);

    preview.click();

    expect(fixture.componentInstance.activated).toEqual([requireItem(fixture.componentInstance.images(), 1)]);
    expect(document.activeElement).toBe(preview);
  });
});

describe('Gallery keyboard navigation', (): void => {
  it('moves in distinct directions and transfers thumbnail focus to the selected image', (): void => {
    const fixture: ComponentFixture<Host> = render(Host);
    const thumbnails: readonly HTMLButtonElement[] = Array.from(
      query(fixture, '[role="group"][aria-label="Choose image"]').querySelectorAll('button'),
    );
    requireItem(thumbnails, 0).focus();
    press(requireItem(thumbnails, 0), 'ArrowLeft');
    fixture.detectChanges();

    expect(fixture.componentInstance.active()).toBe(2);
    expect(document.activeElement).toBe(requireItem(thumbnails, 2));
    expect(thumbnails.map((thumbnail: HTMLButtonElement): number => thumbnail.tabIndex)).toEqual([-1, -1, 0]);

    press(requireItem(thumbnails, 2), 'ArrowRight');
    fixture.detectChanges();

    expect(fixture.componentInstance.active()).toBe(0);
    expect(document.activeElement).toBe(requireItem(thumbnails, 0));
  });

  it('navigates without wrapping and stops at both boundaries', (): void => {
    const fixture: ComponentFixture<Host> = render(Host);
    fixture.componentInstance.wrap.set(false);
    fixture.componentInstance.active.set(1);
    fixture.detectChanges();
    const gallery: Element = query(fixture, '[role="region"][aria-label="Image gallery"]');
    press(gallery, 'ArrowRight');
    press(gallery, 'ArrowRight');

    expect(fixture.componentInstance.active()).toBe(2);

    press(gallery, 'ArrowLeft');
    press(gallery, 'ArrowLeft');
    press(gallery, 'ArrowLeft');

    expect(fixture.componentInstance.active()).toBe(0);
  });
});

describe('Gallery external indexes', (): void => {
  it.each([
    { index: 22, wrap: true, action: 'Next image', selected: 2, expected: 0 },
    { index: 20, wrap: false, action: 'Previous image', selected: 2, expected: 1 },
    { index: -20, wrap: true, action: 'Next image', selected: 0, expected: 1 },
  ])(
    'navigates from the displayed image after index $index with wrap=$wrap',
    ({ index, wrap, action, selected, expected }): void => {
      const fixture: ComponentFixture<Host> = render(Host);
      fixture.componentInstance.active.set(index);
      fixture.componentInstance.wrap.set(wrap);
      fixture.detectChanges();

      expect(query(fixture, '[role="region"]').textContent).toContain(`${selected + 1} / 3`);
      expect(fixture.componentInstance.active()).toBe(index);

      query(fixture, `[aria-label="${action}"]`).dispatchEvent(new MouseEvent('click', { bubbles: true }));
      fixture.detectChanges();

      expect(fixture.componentInstance.active()).toBe(expected);
      expect(query(fixture, '[role="region"]').textContent).toContain(`${expected + 1} / 3`);
    },
  );
});

describe('Gallery presentation', (): void => {
  it('exposes the selected fit mode and current image count', (): void => {
    const fixture: ComponentFixture<Host> = render(Host);
    fixture.componentInstance.active.set(2);
    fixture.componentInstance.fit.set('contain');
    fixture.detectChanges();
    const gallery: Element = query(fixture, '[role="region"][aria-label="Image gallery"]');

    expect(gallery.getAttribute('data-fit')).toBe('contain');
    expect(gallery.textContent).toContain('3 / 3');
    expect(query(fixture, 'img[alt="C"]')).toBeTruthy();
  });

  it('allows navigation, thumbnails and the counter to be hidden', (): void => {
    const fixture: ComponentFixture<Host> = render(Host);
    fixture.componentInstance.showNavigation.set(false);
    fixture.componentInstance.showThumbnails.set(false);
    fixture.componentInstance.showCounter.set(false);
    fixture.detectChanges();
    const gallery: Element = query(fixture, '[role="region"]');

    expect(gallery.querySelector('[aria-label="Previous image"]')).toBeNull();
    expect(gallery.querySelector('[aria-label="Next image"]')).toBeNull();
    expect(gallery.querySelector('[role="group"]')).toBeNull();
    expect(gallery.textContent).not.toContain('1 / 3');
    expect(query(fixture, 'img[alt="A"]')).toBeTruthy();
  });
});

describe('Gallery empty state', (): void => {
  it('renders an empty state without image navigation', (): void => {
    const fixture: ComponentFixture<Host> = render(Host);
    fixture.componentInstance.images.set([]);
    fixture.detectChanges();
    const gallery: Element = query(fixture, '[role="region"][aria-label="Image gallery"]');

    expect(gallery.textContent).toContain('No images available');
    expect(gallery.querySelector('[aria-label="Next image"]')).toBeNull();
    expect(gallery.querySelector('[role="group"]')).toBeNull();
  });
});
