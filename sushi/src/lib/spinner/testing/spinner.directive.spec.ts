import { Component } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { query, render } from '../../../../testing/test-utils';
import { Spinner } from '../spinner.directive';

@Component({ imports: [Spinner], template: `<span suiSpinner type="bars" size="lg"></span>` })
class SpinnerHost {}

describe('Spinner', (): void => {
  it('renders a decorative loading shape at the selected size', (): void => {
    const fixture: ComponentFixture<SpinnerHost> = render(SpinnerHost);
    const spinner: HTMLSpanElement = query(fixture, 'span');
    expect(spinner.classList).toContain('loading-bars');
    expect(spinner.classList).toContain('loading-lg');
    expect(spinner.getAttribute('aria-hidden')).toBe('true');
  });
});
