import { Orientation } from '../sushi.types';

/** Semantic feedback colors available to messages. */
export type MessageSeverity = 'info' | 'success' | 'warning' | 'error';
/** Visual treatments available to messages. */
export type MessageVariant = 'soft' | 'outlined' | 'dash';
/** Direction used to arrange message content and actions. */
export type MessageOrientation = Orientation;
