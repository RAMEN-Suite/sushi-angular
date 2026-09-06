import { Component } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { query, render } from '../../../../testing/test-utils';
import { IndicatorItem } from '../indicator-item.directive';
import { Indicator } from '../indicator.directive';

@Component({
  imports: [Indicator, IndicatorItem],
  template: `<div suiIndicator><span suiIndicatorItem horizontal="start" vertical="bottom">3</span></div>`,
})
class IndicatorHost {}

describe('Indicator', (): void => {
  it('establishes a target and positions its item on both axes', (): void => {
    const fixture: ComponentFixture<IndicatorHost> = render(IndicatorHost);
    expect(query(fixture, '[suiIndicator]').classList).toContain('indicator');
    const item: Element = query(fixture, '[suiIndicatorItem]');
    expect(item.classList).toContain('indicator-start');
    expect(item.classList).toContain('indicator-bottom');
  });
});
