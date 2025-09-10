import { AbstractControl } from '@angular/forms';
import { countriesCodes } from './countries-codes';

export const prefixValidator = (
  control: AbstractControl
): { invalidPrefix: boolean } | null => {
  if (control.value == null || control.value.length === 0) {
    return null;
  }

  return countriesCodes.includes(control.value)
    ? null
    : { invalidPrefix: true };
};
