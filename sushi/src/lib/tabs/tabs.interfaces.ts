import { ComponentSize, Orientation } from '../sushi.types';

/** Identifier used to select one tab. */
export type TabsValue = string;
/** Visual treatments available to tab lists. */
export type TabsVariant = 'plain' | 'border' | 'lift' | 'box';
/** Size scale available to tabs. */
export type TabsSize = ComponentSize;
/** Direction in which tab labels are arranged. */
export type TabsOrientation = Orientation;
/** Edge on which a horizontal tab list is rendered. */
export type TabsPlacement = 'top' | 'bottom';
/** Determines whether focus or explicit activation selects a tab. */
export type TabsSelectionMode = 'follow' | 'explicit';
/** Keyboard focus strategy used by the tab list. */
export type TabsFocusMode = 'roving' | 'activedescendant';
