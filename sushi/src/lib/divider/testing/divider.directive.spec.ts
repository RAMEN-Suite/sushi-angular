import { Component } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { query, render } from '../../../../testing/test-utils';
import { Divider } from '../divider.directive';

@Component({
  imports: [Divider],
  template: `<div suiDivider severity="secondary" orientation="vertical" placement="end">Or</div>`,
})
class DividerHost {}

describe('Divider', (): void => {
  it('applies axis, placement, and semantic color without interaction semantics', (): void => {
    const fixture: ComponentFixture<DividerHost> = render(DividerHost);
    const divider: Element = query(fixture, '[suiDivider]');
    expect(divider.classList).toContain('divider-horizontal');
    expect(divider.classList).toContain('divider-end');
    expect(divider.classList).toContain('divider-secondary');
    expect(divider.textContent).toBe('Or');
    expect(divider.hasAttribute('tabindex')).toBe(false);
  });
});
