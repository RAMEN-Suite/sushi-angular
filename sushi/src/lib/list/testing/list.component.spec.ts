import { Component, signal, WritableSignal } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { query, queryAll, render } from '../../../../testing/test-utils';
import { List } from '../list.component';
import type { ListTrackBy } from '../list.interfaces';
import { ListItemTemplate } from '../list.templates';

interface Person {
  readonly id: number;
  readonly name: string;
}

@Component({
  imports: [List, ListItemTemplate],
  template: `
    <sui-list ariaLabel="Team" size="sm" rowHover [dividers]="dividers()" [items]="items()" [trackBy]="trackPerson">
      <ng-template suiListItem let-person let-index="index" let-count="count" let-first="first" let-last="last">
        <span [attr.data-id]="person.id">{{ index + 1 }}/{{ count }} {{ person.name }} {{ first }} {{ last }}</span>
      </ng-template>
    </sui-list>
  `,
})
class ListHost {
  public readonly dividers: WritableSignal<boolean> = signal<boolean>(true);
  public readonly items: WritableSignal<readonly Person[]> = signal<readonly Person[]>([
    { id: 1, name: 'Avery' },
    { id: 2, name: 'Morgan' },
  ]);
  public readonly trackPerson: ListTrackBy<Person> = (_index: number, person: Person): number => person.id;
}

describe('List', (): void => {
  it('renders native rows with positional template context', (): void => {
    const fixture: ComponentFixture<ListHost> = render(ListHost);
    expect(query(fixture, 'ul').getAttribute('aria-label')).toBe('Team');
    expect(queryAll(fixture, 'li')).toHaveLength(2);
    expect(query(fixture, '[data-id="1"]').textContent.trim()).toBe('1/2 Avery true false');
    expect(query(fixture, '[data-id="2"]').textContent.trim()).toBe('2/2 Morgan false true');
  });

  it('applies hover, density, and divider choices without adding interaction roles', (): void => {
    const fixture: ComponentFixture<ListHost> = render(ListHost);
    const list: Element = query(fixture, 'ul');
    expect(list.classList).toContain('sui-list--row-hover');
    expect(list.classList).toContain('sui-list--sm');
    expect(list.hasAttribute('role')).toBe(false);
    fixture.componentInstance.dividers.set(false);
    fixture.detectChanges();
    expect(list.classList).toContain('sui-list--without-dividers');
  });

  it('keeps tracked row elements when item data changes', (): void => {
    const fixture: ComponentFixture<ListHost> = render(ListHost);
    const firstRow: Element = query(fixture, 'li');
    fixture.componentInstance.items.update((people: readonly Person[]): readonly Person[] => [
      { id: people[0].id, name: 'Updated' },
      people[1],
    ]);
    fixture.detectChanges();
    expect(query(fixture, 'li')).toBe(firstRow);
    expect(query(fixture, '[data-id="1"]').textContent).toContain('Updated');
  });
});
