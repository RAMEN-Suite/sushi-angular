import { ComponentSize, ThemeSeverity } from '../sushi.types';

/** Semantic colors available to status markers. */
export type StatusSeverity = ThemeSeverity;
/** Size scale available to status markers. */
export type StatusSize = ComponentSize;
/** Optional motion treatments for live status markers. */
export type StatusAnimation = 'ping' | 'bounce';
