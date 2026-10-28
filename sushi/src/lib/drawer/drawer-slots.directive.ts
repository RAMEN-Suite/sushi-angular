import { Directive } from '@angular/core';

/** Marks the optional main content area arranged beside a persistent Drawer panel. */
@Directive({ selector: '[suiDrawerContent]' })
export class DrawerContent {}

/** Marks content that remains fixed above the scrollable Drawer body. */
@Directive({ selector: '[suiDrawerHeader]' })
export class DrawerHeader {}

/** Marks content that remains fixed below the scrollable Drawer body. */
@Directive({ selector: '[suiDrawerFooter]' })
export class DrawerFooter {}
