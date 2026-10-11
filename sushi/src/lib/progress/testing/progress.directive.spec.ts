import { Component } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { query, render } from '../../../../testing/test-utils';
import { Progress } from '../progress.directive';

@Component({
  imports: [Progress],
  template: `<progress suiProgress value="35" max="100" severity="info" animation="glow"></progress>`,
})
class ProgressHost {}

describe('Progress', (): void => {
  it('applies configured severity and animation', (): void => {
    const fixture: ComponentFixture<ProgressHost> = render(ProgressHost);
    const progress: HTMLProgressElement = query(fixture, 'progress');

    expect(progress.classList).toContain('progress-info');
    expect(progress.classList).toContain('sui-progress--glow');
  });
});
