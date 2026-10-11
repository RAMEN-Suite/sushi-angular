import { Component } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { query, render } from '../../../../testing/test-utils';
import { Kbd } from '../kbd.directive';

@Component({ imports: [Kbd], template: `<kbd suiKbd size="xs">⌘ K</kbd>` })
class KbdHost {}

describe('Kbd', (): void => {
  it('applies configured density without making the key focusable', (): void => {
    const fixture: ComponentFixture<KbdHost> = render(KbdHost);
    const key: HTMLElement = query(fixture, 'kbd');

    expect(key.classList).toContain('kbd-xs');
    expect(key.hasAttribute('tabindex')).toBe(false);
  });
});
