import { Component, signal, WritableSignal } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { query, queryAll, render } from '../../../../testing/test-utils';
import { DataView } from '../data-view.component';
import type { DataViewLayout } from '../data-view.interfaces';
import {
  DataViewEmptyTemplate,
  DataViewHeaderTemplate,
  DataViewItemTemplate,
  DataViewLoadMoreTemplate,
  DataViewLoadingTemplate,
} from '../data-view.templates';

@Component({
  imports: [DataView, DataViewEmptyTemplate, DataViewHeaderTemplate, DataViewItemTemplate, DataViewLoadingTemplate],
  template: `
    <sui-data-view
      ariaLabel="Recipes"
      paginate
      [items]="items()"
      [layouts]="['list', 'grid']"
      [loading]="loading()"
      [pageSize]="2"
      [(layout)]="layout"
      [(page)]="page"
    >
      <ng-template suiDataViewHeader let-items
        ><span data-header>{{ items.length }} visible</span></ng-template
      >
      <ng-template suiDataViewItem let-item let-index="index" let-first="first" let-last="last">
        <span [attr.data-item]="item" [attr.data-index]="index" [attr.data-first]="first" [attr.data-last]="last">
          {{ item }}
        </span>
      </ng-template>
      <ng-template suiDataViewEmpty><span data-empty>Nothing here</span></ng-template>
      <ng-template suiDataViewLoading><span data-loading>Fetching recipes</span></ng-template>
    </sui-data-view>
  `,
})
class DataViewHost {
  public readonly items: WritableSignal<readonly string[]> = signal<readonly string[]>(['Miso', 'Shoyu', 'Tantan', 'Yuzu']);
  public readonly layout: WritableSignal<DataViewLayout> = signal<DataViewLayout>('list');
  public readonly loading: WritableSignal<boolean> = signal<boolean>(false);
  public readonly page: WritableSignal<number> = signal<number>(1);
}

@Component({
  imports: [DataView, DataViewItemTemplate, DataViewLoadMoreTemplate],
  template: `
    <sui-data-view infiniteScroll hasMore [items]="items" (loadMore)="loads += 1">
      <ng-template suiDataViewItem let-item>{{ item }}</ng-template>
      <ng-template suiDataViewLoadMore let-loading="loading" let-load="load">
        <button data-load type="button" [attr.data-loading]="loading" (click)="load()">More</button>
      </ng-template>
    </sui-data-view>
  `,
})
class InfiniteDataViewHost {
  public readonly items: readonly string[] = ['Miso'];
  public loads: number = 0;
}

describe('DataView collection rendering', (): void => {
  it('renders the current local page with item and collection contexts', (): void => {
    const fixture: ComponentFixture<DataViewHost> = render(DataViewHost);
    expect(queryAll(fixture, '[data-item]')).toHaveLength(2);
    expect(query(fixture, '[data-item="Miso"]').getAttribute('data-first')).toBe('true');
    expect(query(fixture, '[data-item="Shoyu"]').getAttribute('data-last')).toBe('true');
    expect(query(fixture, '[data-header]').textContent).toBe('2 visible');
    expect(query(fixture, 'ul').getAttribute('aria-label')).toBe('Recipes');
  });

  it('changes the visible local page through its SUSHI pagination', (): void => {
    const fixture: ComponentFixture<DataViewHost> = render(DataViewHost);
    query(fixture, '[aria-label="Next page"]').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.page()).toBe(2);
    expect(query(fixture, '[data-item="Tantan"]')).toBeTruthy();
    expect(query(fixture, '[data-item="Yuzu"]')).toBeTruthy();
  });

  it('switches layouts through its SUSHI SelectButton', (): void => {
    const fixture: ComponentFixture<DataViewHost> = render(DataViewHost);
    const radios: readonly HTMLButtonElement[] = queryAll(fixture, '[role="radio"]') as readonly HTMLButtonElement[];
    radios[1].click();
    fixture.detectChanges();

    expect(fixture.componentInstance.layout()).toBe('grid');
    expect(query(fixture, 'ul').classList.contains('sui-data-view__grid')).toBe(true);
  });
});

describe('DataView collection states', (): void => {
  it('renders custom loading and empty content', (): void => {
    const fixture: ComponentFixture<DataViewHost> = render(DataViewHost);
    fixture.componentInstance.loading.set(true);
    fixture.detectChanges();
    expect(query(fixture, '[data-loading]').textContent).toBe('Fetching recipes');
    expect(query(fixture, 'sui-data-view').getAttribute('aria-busy')).toBe('true');

    fixture.componentInstance.loading.set(false);
    fixture.componentInstance.items.set([]);
    fixture.detectChanges();
    expect(query(fixture, '[data-empty]').textContent).toBe('Nothing here');
  });

  it('requests more items through a custom infinite-scroll control', (): void => {
    const fixture: ComponentFixture<InfiniteDataViewHost> = render(InfiniteDataViewHost);
    const load: HTMLButtonElement = query(fixture, 'button');
    expect(load.getAttribute('data-loading')).toBe('false');
    load.click();

    expect(fixture.componentInstance.loads).toBe(1);
    expect(queryAll(fixture, '[role="navigation"]')).toHaveLength(0);
  });
});
