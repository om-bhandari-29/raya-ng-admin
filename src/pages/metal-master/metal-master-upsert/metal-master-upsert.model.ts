import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MetalMasterType } from '../../../core/enum/metal-master.enum';

export interface MetalPurityDialogData {
  /** 0 for create, positive id for edit */
  itemId: number;
  metalMasterType: MetalMasterType;

  metalMasterId?: number; // for purity only
}

export interface MetalPurityForm {
  name: FormControl<string>; //for metal

  metal_id: FormControl<number>;
  purity: FormControl<string>;
  percentage: FormControl<number>;
  rate_per_gram_inr: FormControl<number>;
  rate_per_gram_usd: FormControl<number>;
}

export const initializeForm = (): FormGroup<MetalPurityForm> => {
  const form = new FormGroup<MetalPurityForm>({
    name: new FormControl('', {
      nonNullable: true,
      validators: [], // Clean slate
    }),
    metal_id: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required], // Keep if always mandatory
    }),
    purity: new FormControl('', {
      nonNullable: true,
      validators: [], // Clean slate
    }),
    percentage: new FormControl(0, {
      nonNullable: true,
      validators: [], // Clean slate
    }),
    rate_per_gram_inr: new FormControl(0, {
      nonNullable: true,
      validators: [], // Clean slate
    }),
    rate_per_gram_usd: new FormControl(0, {
      nonNullable: true,
      validators: [], // Clean slate
    }),
  });

  return form;
};
