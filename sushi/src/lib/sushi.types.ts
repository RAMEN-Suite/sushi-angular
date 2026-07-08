import { InputSignalWithTransform, Signal, TemplateRef } from '@angular/core';

export type SuiBooleanInputValue = string | boolean;
export type SuiBooleanInput = InputSignalWithTransform<boolean, SuiBooleanInputValue>;
export type SuiTemplate<T> = Signal<TemplateRef<T> | undefined>;
