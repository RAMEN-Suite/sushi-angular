import { Component, signal, type WritableSignal } from '@angular/core';
import { type ComponentFixture } from '@angular/core/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { press, queryAll, render } from '../../../../testing/test-utils';
import { Menu } from '../menu.component';
import { type MenuItem } from '../menu.interfaces';

@Component({
  imports: [Menu],
  template: `<sui-menu ariaLabel="Document actions" [items]="items" [wrap]="wrap()" [typeaheadDelay]="typeaheadDelay()" />`,
})
class NavigationHost {
  public readonly items: readonly MenuItem[] = [
    { label: 'Open', value: 'open' },
    { label: 'Archive', value: 'archive' },
    { label: 'Delete', value: 'delete', disabled: true },
    { label: 'Share', value: 'share', items: [{ label: 'Copy link', value: 'copy' }] },
    { label: 'Save', value: 'save' },
  ];
  public readonly typeaheadDelay: WritableSignal<number> = signal<number>(500);
  public readonly wrap: WritableSignal<boolean> = signal<boolean>(true);
}

function action(fixture: ComponentFixture<NavigationHost>, label: string): HTMLButtonElement {
  const button: HTMLButtonElement | undefined = queryAll(fixture, 'button').find(
    (element: HTMLButtonElement): boolean => element.getAttribute('role') === 'menuitem' && element.textContent.trim() === label,
  );
  if (button === undefined) throw new Error(`Expected the menu action "${label}".`);
  return button;
}

afterEach((): void => {
  vi.useRealTimers();
});

describe('Menu arrow navigation', (): void => {
  it('moves in both directions and skips disabled actions', (): void => {
    const fixture: ComponentFixture<NavigationHost> = render(NavigationHost);
    const archive: HTMLButtonElement = action(fixture, 'Archive');
    archive.focus();
    press(archive, 'ArrowDown');
    fixture.detectChanges();
    const share: HTMLButtonElement = action(fixture, 'Share');

    expect(document.activeElement).toBe(share);

    press(share, 'ArrowUp');
    fixture.detectChanges();

    expect(document.activeElement).toBe(archive);
  });

  it.each([true, false])('honors wrap=%s at the last action after a successful move', (wrap: boolean): void => {
    const fixture: ComponentFixture<NavigationHost> = render(NavigationHost);
    fixture.componentInstance.wrap.set(wrap);
    fixture.detectChanges();
    const share: HTMLButtonElement = action(fixture, 'Share');
    share.focus();
    press(share, 'ArrowDown');
    fixture.detectChanges();
    const save: HTMLButtonElement = action(fixture, 'Save');

    expect(document.activeElement).toBe(save);

    press(save, 'ArrowDown');
    fixture.detectChanges();

    expect(document.activeElement).toBe(wrap ? action(fixture, 'Open') : save);
  });
});

describe('Menu submenu navigation', (): void => {
  it('enters a submenu with ArrowRight and returns to its disclosure with ArrowLeft', (): void => {
    const fixture: ComponentFixture<NavigationHost> = render(NavigationHost);
    const share: HTMLButtonElement = action(fixture, 'Share');
    share.focus();
    press(share, 'ArrowRight');
    fixture.detectChanges();
    const copy: HTMLButtonElement = action(fixture, 'Copy link');

    expect(share.getAttribute('aria-expanded')).toBe('true');
    expect(document.activeElement).toBe(copy);

    press(copy, 'ArrowLeft');
    fixture.detectChanges();

    expect(share.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(share);
  });
});

describe('Menu typeahead', (): void => {
  it.each([
    { delay: 10, expected: 'Archive' },
    { delay: 1000, expected: 'Save' },
  ])('clears the search buffer after its configured $delay ms delay', ({ delay, expected }): void => {
    vi.useFakeTimers();
    const fixture: ComponentFixture<NavigationHost> = render(NavigationHost);
    fixture.componentInstance.typeaheadDelay.set(delay);
    fixture.detectChanges();
    const open: HTMLButtonElement = action(fixture, 'Open');
    open.focus();
    press(open, 's');
    fixture.detectChanges();
    const share: HTMLButtonElement = action(fixture, 'Share');

    expect(document.activeElement).toBe(share);

    vi.advanceTimersByTime(50);
    press(share, 'a');
    fixture.detectChanges();

    expect(document.activeElement).toBe(action(fixture, expected));
  });
});
