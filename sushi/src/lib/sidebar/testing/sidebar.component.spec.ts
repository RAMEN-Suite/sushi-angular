import { Component, signal, WritableSignal } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { query, queryAll, render } from '../../../../testing/test-utils';
import { NavbarItem } from '../../navbar';
import { Sidebar } from '../sidebar.component';
import { SidebarGroupTemplate } from '../sidebar-group-template.directive';
import { SidebarItemTemplate } from '../sidebar-item-template.directive';
import { SidebarGroup } from '../sidebar.interfaces';
import { SidebarFooter, SidebarHeader } from '../sidebar-slots.directive';

type Page = 'overview' | 'activity' | 'settings';

interface AppItem extends NavbarItem<Page> {
  readonly badge?: string;
}

@Component({
  imports: [Sidebar, SidebarFooter, SidebarGroupTemplate, SidebarHeader, SidebarItemTemplate],
  template: `
    <sui-sidebar
      ariaLabel="Project navigation"
      size="lg"
      [bordered]="bordered()"
      [groups]="groups"
      [(value)]="active"
      (itemSelected)="selected.push($event)"
    >
      <div suiSidebarHeader data-header>Orbit</div>
      <ng-template [suiSidebarGroup]="groups" let-group
        ><span [attr.data-drawer-group]="group.label">{{ group.label }}</span></ng-template
      >
      <ng-template [suiSidebarItem]="groups" let-item let-group="group" let-level="level">
        <span [attr.data-item]="item.value" [attr.data-group]="group.label" [attr.data-level]="level">
          {{ item.label }} {{ item.badge }}
        </span>
      </ng-template>
      <div suiSidebarFooter data-footer>Signed in</div>
    </sui-sidebar>
  `,
})
class SidebarHost {
  public readonly active: WritableSignal<Page> = signal<Page>('overview');
  public readonly bordered: WritableSignal<boolean> = signal<boolean>(true);
  public readonly selected: Page[] = [];
  public readonly groups: readonly SidebarGroup<AppItem>[] = [
    {
      label: 'Workspace',
      items: [
        { label: 'Overview', value: 'overview' },
        { label: 'Activity', value: 'activity', badge: '4' },
      ],
    },
    { label: 'Administration', items: [{ label: 'Settings', value: 'settings' }] },
    { label: 'Empty', items: [] },
  ];
}

describe('Sidebar', (): void => {
  it('renders one labeled landmark with header, footer, and non-empty navigation groups', (): void => {
    const fixture: ComponentFixture<SidebarHost> = render(SidebarHost);
    const sidebar: Element = query(fixture, 'sui-sidebar');

    expect(sidebar.getAttribute('role')).toBe('complementary');
    expect(sidebar.getAttribute('aria-label')).toBe('Project navigation');
    expect(sidebar.classList.contains('sui-sidebar--lg')).toBe(true);
    expect(sidebar.classList.contains('sui-sidebar--bordered')).toBe(true);
    expect(query(fixture, '[data-header]').textContent).toContain('Orbit');
    expect(query(fixture, '[data-footer]').textContent).toContain('Signed in');
    expect(queryAll(fixture, 'nav')).toHaveLength(2);
    expect(query(fixture, '[data-drawer-group="Workspace"]')).toBeDefined();
  });

  it('forwards item, group, and nesting context to the custom template', (): void => {
    const fixture: ComponentFixture<SidebarHost> = render(SidebarHost);
    const activity: Element = query(fixture, '[data-item="activity"]');

    expect(activity.textContent).toContain('Activity 4');
    expect(activity.getAttribute('data-group')).toBe('Workspace');
    expect(activity.getAttribute('data-level')).toBe('0');
  });

  it('allows consumers to remove the default frame', (): void => {
    const fixture: ComponentFixture<SidebarHost> = render(SidebarHost);
    fixture.componentInstance.bordered.set(false);
    fixture.detectChanges();

    expect(query(fixture, 'sui-sidebar').classList).not.toContain('sui-sidebar--bordered');
  });

  it('reflects the current destination and emits selection changes', (): void => {
    const fixture: ComponentFixture<SidebarHost> = render(SidebarHost);
    expect(query(fixture, '[data-item="overview"]').closest('button')?.getAttribute('aria-current')).toBe('page');

    const activity: HTMLButtonElement | null = query(fixture, '[data-item="activity"]').closest('button');
    if (activity === null) throw new Error('Expected the Sidebar item inside a button.');
    activity.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.selected).toEqual(['activity']);
    expect(fixture.componentInstance.active()).toBe('activity');
    expect(activity.getAttribute('aria-current')).toBe('page');
  });
});
