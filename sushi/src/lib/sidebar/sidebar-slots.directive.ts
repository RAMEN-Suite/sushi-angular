import { Directive } from '@angular/core';

/** Marks product identity or workspace controls projected above Sidebar navigation. */
@Directive({ selector: '[suiSidebarHeader]', host: { class: 'sui-sidebar__header' } })
export class SidebarHeader {}

/** Marks account, status, or secondary actions projected below Sidebar navigation. */
@Directive({ selector: '[suiSidebarFooter]', host: { class: 'sui-sidebar__footer' } })
export class SidebarFooter {}
