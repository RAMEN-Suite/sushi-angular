import { InputSignalWithTransform, Signal, TemplateRef } from '@angular/core';

export type BooleanInputValue = string | boolean;
export type BooleanSignal = InputSignalWithTransform<boolean, BooleanInputValue>;
export type Template<T> = Signal<TemplateRef<T> | undefined>;
