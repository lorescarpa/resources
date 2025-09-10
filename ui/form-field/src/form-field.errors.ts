/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/** @docs-private */
export function getBriFormFieldPlaceholderConflictError(): Error {
  return Error('Placeholder attribute and child element were both specified.');
}

/** @docs-private */
export function getBriFormFieldDuplicatedHintError(align: string): Error {
  return Error(`A hint was already declared for 'align="${align}"'.`);
}

/** @docs-private */
export function getBriFormFieldMissingControlError(): Error {
  return Error('bri-form-field must contain a BriFormFieldControl.');
}
