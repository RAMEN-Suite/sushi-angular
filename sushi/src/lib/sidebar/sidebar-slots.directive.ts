import { Directive } from '@angular/core';

/** Projects product identity or workspace controls above Sidebar navigation. */
@Directive({ selector: '[suiSidebarHeader]', host: { class: 'sui-sidebar__header' } })
export class SidebarHeader {}

/** Projects account, status, or secondary actions below Sidebar navigation. */
@Directive({ selector: '[suiSidebarFooter]', host: { class: 'sui-sidebar__footer' } })
export class SidebarFooter {}
