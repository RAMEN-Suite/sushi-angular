import { Component, signal, WritableSignal } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import { query, queryAll, render } from '../../../../testing/test-utils';
import { NavbarItem } from '../../navbar';
import { Sidebar } from '../sidebar.component';
import { SidebarGroupTemplate } from '../sidebar-group-template.directive';
import { SidebarItemTemplate } from '../sidebar-item-template.directive';
import { SidebarGroup } from '../sidebar.interfaces';
import { SidebarFooter, SidebarHeader } from '../sidebar-slots.directive';

type Page = 'overview' | 'activity' | 'reports' | 'activity-reports' | 'settings';

interface AppItem extends NavbarItem<Page> {
  readonly badge?: string;
}

@Component({
  imports: [Sidebar, SidebarFooter, SidebarGroupTemplate, SidebarHeader, SidebarItemTemplate],
  template: `
    <sui-sidebar
      ariaLabel="Project navigation"
      size="lg"
      [groups]="groups"
      [(value)]="active"
      [(collapsed)]="collapsed"
      (valueChange)="selected.push($event)"
    >
      <div suiSidebarHeader data-header>Orbit</div>
      <ng-template [suiSidebarGroup]="groups" let-group let-collapsed="collapsed"
        ><span [attr.data-drawer-group]="group.label" [attr.data-collapsed]="collapsed">{{ group.label }}</span></ng-template
      >
      <ng-template [suiSidebarItem]="groups" let-item let-group="group" let-level="level" let-collapsed="collapsed">
        <span
          [attr.data-item]="item.value"
          [attr.data-group]="group.label"
          [attr.data-level]="level"
          [attr.data-collapsed]="collapsed"
        >
          {{ item.label }} {{ item.badge }}
        </span>
      </ng-template>
      <div suiSidebarFooter data-footer>Signed in</div>
    </sui-sidebar>
  `,
})
class SidebarHost {
  public readonly active: WritableSignal<Page> = signal<Page>('overview');
  public readonly collapsed: WritableSignal<boolean> = signal(false);
  public readonly selected: (Page | null)[] = [];
  public readonly groups: readonly SidebarGroup<AppItem>[] = [
    {
      label: 'Workspace',
      items: [
        { label: 'Overview', value: 'overview' },
        { label: 'Activity', value: 'activity', badge: '4' },
        { label: 'Reports', value: 'reports', items: [{ label: 'Activity reports', value: 'activity-reports' }] },
      ],
    },
    { label: 'Administration', items: [{ label: 'Settings', value: 'settings', disabled: true }] },
    { label: 'Empty', items: [] },
  ];
}

afterEach((): void => document.querySelector('.cdk-overlay-container')?.remove());

describe('Sidebar', (): void => {
  it('renders one labeled landmark with header, footer, and non-empty navigation groups', (): void => {
    const fixture: ComponentFixture<SidebarHost> = render(SidebarHost);
    const sidebar: Element = query(fixture, 'sui-sidebar');

    expect(sidebar.getAttribute('role')).toBe('complementary');
    expect(sidebar.getAttribute('aria-label')).toBe('Project navigation');
    expect(sidebar.classList.contains('sui-sidebar--lg')).toBe(true);
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
    expect(query(fixture, '[data-item="activity-reports"][data-level="1"]')).toBeDefined();
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

describe('Sidebar disabled state', (): void => {
  it('keeps disabled destinations focusable without selecting them', (): void => {
    const fixture: ComponentFixture<SidebarHost> = render(SidebarHost);
    const settings: HTMLButtonElement | null = query(fixture, '[data-item="settings"]').closest('button');
    if (!settings) throw new Error('Expected the disabled Sidebar item inside a button.');
    settings.focus();
    settings.click();

    expect(settings.getAttribute('aria-disabled')).toBe('true');
    expect(document.activeElement).toBe(settings);
    expect(fixture.componentInstance.active()).toBe('overview');
    expect(fixture.componentInstance.selected).toEqual([]);
  });
});

describe('Sidebar collapsed rail', (): void => {
  it('reflects and exposes its collapsed icon-rail state', (): void => {
    const fixture: ComponentFixture<SidebarHost> = render(SidebarHost);
    fixture.componentInstance.collapsed.set(true);
    fixture.detectChanges();

    expect(query(fixture, 'sui-sidebar').hasAttribute('data-collapsed')).toBe(true);
    expect(query(fixture, '[data-item="overview"]').getAttribute('data-collapsed')).toBe('true');
    expect(query(fixture, '[data-drawer-group="Workspace"]').getAttribute('data-collapsed')).toBe('true');
  });

  it('opens nested destinations in a flyout while collapsed', async (): Promise<void> => {
    const fixture: ComponentFixture<SidebarHost> = render(SidebarHost);
    fixture.componentInstance.collapsed.set(true);
    fixture.detectChanges();

    expect(queryAll(fixture, '[data-item="activity-reports"]')).toHaveLength(0);

    const reports: HTMLButtonElement | null = query(fixture, '[data-item="reports"]').closest('button');
    if (reports === null) throw new Error('Expected the collapsed parent inside a button.');
    reports.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const child: HTMLElement | null = document.querySelector('[data-item="activity-reports"]');
    expect(child).not.toBeNull();
    child?.closest('button')?.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.active()).toBe('activity-reports');
    expect(document.querySelector('[data-item="activity-reports"]')).toBeNull();
  });
});
