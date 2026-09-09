/** Edge from which a Drawer enters the viewport. */
export type DrawerPlacement = 'start' | 'end';

/** Supported Drawer widths. */
export type DrawerSize = 'sm' | 'md' | 'lg';

/** Viewport width at which a Drawer becomes a persistent panel. */
export type DrawerPersistentAt = 'sm' | 'md' | 'lg' | 'xl';

/** Reason emitted when a Drawer requests to close. */
export type DrawerCloseReason = 'backdrop' | 'escape' | 'programmatic';
