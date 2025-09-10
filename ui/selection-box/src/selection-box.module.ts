import { NgModule } from '@angular/core';
import { BriSelectionBoxComponent } from './selection-box.component';
import { BriSelectionBoxItemComponent } from './selection-box-item.component';
import { BriRadioModule } from '@wkp/bricks/radio';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CdkListboxModule } from '@angular/cdk/listbox';

const SELECTION_BOX_DECLARATIONS = [
  BriSelectionBoxComponent,
  BriSelectionBoxItemComponent,
];

@NgModule({
  imports: [
    BriRadioModule,
    CdkListboxModule,
    CommonModule,
    ReactiveFormsModule,
    ...SELECTION_BOX_DECLARATIONS,
  ],
  exports: SELECTION_BOX_DECLARATIONS,
})
export class BriSelectionBoxModule {}
