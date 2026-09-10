import { Component, signal, WritableSignal } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { query, render } from '../../../../testing/test-utils';
import { Skeleton } from '../skeleton.directive';

@Component({ imports: [Skeleton], template: `<span suiSkeleton variant="text" [animated]="animated()">Loading</span>` })
class SkeletonHost {
  public readonly animated: WritableSignal<boolean> = signal<boolean>(true);
}

describe('Skeleton', (): void => {
  it('remains decorative and supports a static state', (): void => {
    const fixture: ComponentFixture<SkeletonHost> = render(SkeletonHost);
    const skeleton: HTMLElement = query(fixture, '[suiSkeleton]') as HTMLElement;
    expect(skeleton.getAttribute('aria-hidden')).toBe('true');
    expect(skeleton.classList).toContain('skeleton-text');
    fixture.componentInstance.animated.set(false);
    fixture.detectChanges();
    expect(skeleton.classList).toContain('sui-skeleton--static');
  });
});
