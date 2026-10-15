import { type ComponentSize } from '../sushi.types';
import { type MaskHalf, type MaskShape } from '../mask';

/** Presence states displayed by an avatar. */
export type AvatarStatus = 'online' | 'offline';
/** Size scale available to avatars. */
export type AvatarSize = ComponentSize;
/** Half retained by half-mask avatar shapes. */
export type AvatarMaskHalf = MaskHalf;

/** Built-in shapes and masks available to avatars. */
export type AvatarShape =
  'square' | 'rounded' | 'circle' | Exclude<MaskShape, 'square' | 'circle'> | 'mask-square' | 'mask-circle';
