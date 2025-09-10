import { inject } from '@angular/core';
import {
  FormControlDirective,
  FormControlName,
  NgControl,
  NgModel,
} from '@angular/forms';

export const injectNgControl = () => {
  const ngControl = inject(NgControl, { self: true, optional: true });

  if (
    ngControl instanceof FormControlDirective ||
    ngControl instanceof FormControlName ||
    ngControl instanceof NgModel
  ) {
    return ngControl;
  }

  return null;
};
