import { Component, signal, WritableSignal } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { query, render } from '../../../../testing/test-utils';
import { CardActions } from '../card-actions.directive';
import { CardMedia } from '../card-media.directive';
import { CardTitle } from '../card-title.directive';
import { Card } from '../card.component';
import type { CardSize, CardVariant } from '../card.interfaces';

@Component({
  imports: [Card, CardActions, CardMedia, CardTitle],
  template: `
    <sui-card [variant]="variant()" [size]="size()">
      <img suiCardMedia alt="Preview" />
      <h2 suiCardTitle>Project</h2>
      <p>Details</p>
      <div suiCardActions><button type="button">Open</button></div>
    </sui-card>
  `,
})
class CardHost {
  public readonly variant: WritableSignal<CardVariant> = signal<CardVariant>('border');
  public readonly size: WritableSignal<CardSize> = signal<CardSize>('md');
}

describe('Card', (): void => {
  it('projects media before its body and styles semantic slots', (): void => {
    const fixture: ComponentFixture<CardHost> = render(CardHost);
    const card: Element = query(fixture, 'sui-card');
    expect(card.firstElementChild?.matches('[suiCardMedia]')).toBe(true);
    expect(query(fixture, '[suiCardTitle]').classList).toContain('card-title');
    expect(query(fixture, '[suiCardActions]').classList).toContain('card-actions');
    expect(query(fixture, '.sui-card__body').textContent).toContain('Details');
  });

  it('updates variant and density classes', (): void => {
    const fixture: ComponentFixture<CardHost> = render(CardHost);
    fixture.componentInstance.variant.set('dash');
    fixture.componentInstance.size.set('xl');
    fixture.detectChanges();
    const card: Element = query(fixture, 'sui-card');
    expect(card.classList).toContain('card-dash');
    expect(card.classList).toContain('card-xl');
    expect(card.classList).not.toContain('card-border');
  });
});
