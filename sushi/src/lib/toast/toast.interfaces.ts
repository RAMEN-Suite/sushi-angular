import { MessageSeverity, MessageVariant } from '../message';

/** Horizontal placement of a Toast outlet. */
export type ToastHorizontalPosition = 'start' | 'center' | 'end';

/** Vertical placement of a Toast outlet. */
export type ToastVerticalPosition = 'top' | 'middle' | 'bottom';

/** Optional action displayed inside a Toast. */
export interface ToastAction {
  /** Visible action label. */
  readonly label: string;
  /** Runs when the action is activated. */
  readonly run: () => void;
  /** Controls whether activating the action dismisses the Toast. */
  readonly dismiss?: boolean;
}

/** Configuration accepted by ToastService.show. */
export interface ToastOptions {
  /** Main Toast message. */
  readonly message: string;
  /** Optional short heading. */
  readonly title?: string;
  /** Semantic feedback color. */
  readonly severity?: MessageSeverity | null;
  /** Visual treatment inherited from Message. */
  readonly variant?: MessageVariant | null;
  /** Time in milliseconds before dismissal. Use zero to keep the Toast open. */
  readonly duration?: number;
  /** Shows the built-in close action. */
  readonly dismissible?: boolean;
  /** Optional contextual action. */
  readonly action?: ToastAction;
  /** Selects a named custom content template from the Toast outlet. */
  readonly template?: string;
}

/** Read-only Toast data exposed to a custom content template. */
export interface ToastTemplateValue {
  /** Stable identifier assigned to the Toast instance. */
  readonly id: string;
  /** Main Toast message. */
  readonly message: string;
  /** Optional Toast heading. */
  readonly title: string | null;
  /** Semantic feedback color. */
  readonly severity: MessageSeverity | null;
  /** Visual treatment inherited from Message. */
  readonly variant: MessageVariant | null;
  /** Time in milliseconds before automatic dismissal. */
  readonly duration: number;
  /** Whether the built-in close action is available. */
  readonly dismissible: boolean;
  /** Optional contextual action. */
  readonly action: ToastAction | null;
  /** Name of the custom content template used by the Toast. */
  readonly template: string | null;
}

/** Values available inside a custom Toast content template. */
export interface ToastTemplateContext {
  /** Current Toast data, available as the implicit template value. */
  readonly $implicit: ToastTemplateValue;
  /** Dismisses the current Toast. */
  readonly dismiss: () => void;
  /** Runs the configured action and applies its dismissal behavior. */
  readonly runAction: () => void;
}

/** @internal Normalized Toast rendered by an outlet. */
export type ToastItem = ToastTemplateValue;
