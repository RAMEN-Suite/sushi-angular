import { Component, signal, WritableSignal } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { query, render } from '../../../../testing/test-utils';
import { AvatarGroup } from '../avatar-group.directive';
import { Avatar } from '../avatar.component';
import type { AvatarShape, AvatarSize, AvatarStatus } from '../avatar.interfaces';

@Component({
  imports: [Avatar, AvatarGroup],
  template: `
    <div suiAvatarGroup>
      <sui-avatar [size]="size()" [shape]="shape()" [maskHalf]="maskHalf()" [status]="status()" [placeholder]="placeholder()">
        <span>AB</span>
      </sui-avatar>
    </div>
  `,
})
class AvatarHost {
  public readonly size: WritableSignal<AvatarSize> = signal<AvatarSize>('md');
  public readonly shape: WritableSignal<AvatarShape> = signal<AvatarShape>('rounded');
  public readonly maskHalf: WritableSignal<'first' | 'second' | null> = signal(null);
  public readonly status: WritableSignal<AvatarStatus | null> = signal<AvatarStatus | null>(null);
  public readonly placeholder: WritableSignal<boolean> = signal<boolean>(false);
}

describe('Avatar', (): void => {
  it('renders identity content in an avatar group', (): void => {
    const fixture: ComponentFixture<AvatarHost> = render(AvatarHost);
    expect(query(fixture, '[suiAvatarGroup]').classList).toContain('avatar-group');
    expect(query(fixture, 'sui-avatar').textContent.trim()).toBe('AB');
    expect(query(fixture, 'sui-avatar > div').classList).toContain('w-16');
  });

  it('applies size, shape, presence, and placeholder state', (): void => {
    const fixture: ComponentFixture<AvatarHost> = render(AvatarHost);
    fixture.componentInstance.size.set('sm');
    fixture.componentInstance.shape.set('circle');
    fixture.componentInstance.status.set('online');
    fixture.componentInstance.placeholder.set(true);
    fixture.detectChanges();

    expect(query(fixture, 'sui-avatar').classList).toContain('avatar-online');
    expect(query(fixture, 'sui-avatar').classList).toContain('avatar-placeholder');
    expect(query(fixture, 'sui-avatar > div').classList).toContain('w-12');
    expect(query(fixture, 'sui-avatar > div').classList).toContain('rounded-full');
    expect(query(fixture, 'sui-avatar > div').classList).toContain('bg-neutral');
    expect(query(fixture, 'sui-avatar > div').classList).toContain('text-neutral-content');
  });

  it('composes decorative shapes through the shared mask behavior', (): void => {
    const fixture: ComponentFixture<AvatarHost> = render(AvatarHost);
    fixture.componentInstance.shape.set('star');
    fixture.componentInstance.maskHalf.set('second');
    fixture.detectChanges();

    const content: Element = query(fixture, 'sui-avatar > div');
    expect(content.classList).toContain('mask');
    expect(content.classList).toContain('mask-star');
    expect(content.classList).toContain('mask-half-2');
  });
});
