import { ComponentSize } from '../sushi.types';

/** Presence states displayed by an avatar. */
export type AvatarStatus = 'online' | 'offline';
/** Size scale available to avatars. */
export type AvatarSize = ComponentSize;
/** Half retained by half-mask avatar shapes. */
export type AvatarMaskHalf = 'first' | 'second';

/** Built-in shapes and masks available to avatars. */
export type AvatarShape =
  | 'square'
  | 'rounded'
  | 'circle'
  | 'squircle'
  | 'heart'
  | 'hexagon'
  | 'hexagon-2'
  | 'decagon'
  | 'pentagon'
  | 'diamond'
  | 'mask-square'
  | 'mask-circle'
  | 'star'
  | 'star-2'
  | 'triangle'
  | 'triangle-2'
  | 'triangle-3'
  | 'triangle-4';
