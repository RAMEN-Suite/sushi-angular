import { Directive } from '@angular/core';

@Directive({ selector: '[suiDrawerContent]' })
/** Marks the optional main content area used by a persistent responsive Drawer layout. */
export class DrawerContent {}

@Directive({ selector: '[suiDrawerHeader]' })
/** Marks content that remains fixed above the scrollable Drawer body. */
export class DrawerHeader {}

@Directive({ selector: '[suiDrawerFooter]' })
/** Marks content that remains fixed below the scrollable Drawer body. */
export class DrawerFooter {}
