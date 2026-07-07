import { InputSignalWithTransform, Signal, TemplateRef } from '@angular/core';

export type SuiBooleanAttribute = string | boolean;
export type SuiBooleanInput = InputSignalWithTransform<boolean, SuiBooleanAttribute>;
export type SuiTemplateSignal<T> = Signal<TemplateRef<T> | undefined>;
