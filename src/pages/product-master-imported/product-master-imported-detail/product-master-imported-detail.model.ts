import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { IBlueprintData, IBlueprintVariant, IStoneZone } from './product-master-imported-detail.response';
import { ISearchableDropdownItem } from '../../../core/component/searchable-dropdown/searchable-dropdown';

export interface ISizeQuantityMatrixForm {
  ring_size: FormControl<string | null>;
  stone_quantity: FormControl<number | null>;
}
export interface IStoneZoneForm {
  zone_slot_id: FormControl<number | null>;
  zone_name: FormControl<string | null>;
  template_id: FormControl<string | null>;
  is_dynamic_by_size: FormControl<boolean | null>;
  fixed_quantity: FormControl<number | null>;
  size_quantity_matrix: FormArray<FormGroup<ISizeQuantityMatrixForm>>;
  selected_size: FormControl<ISearchableDropdownItem | null>;
}

export interface IAllowedMetalForm {
  metal_purity: FormControl<string | null>;
  metal_color: FormControl<string | null>;
}
export interface IBlueprintVariantForm {
  variant: FormControl<string | null>;
  gender: FormControl<string | null>;
  allowed_metals: FormArray<FormGroup<IAllowedMetalForm>>;
  zone_slots: FormArray<FormGroup<IStoneZoneForm>>;
  // selected_metal?: FormControl<string | null>; // Optional UI tracker field
}

export interface FormIBlueprint {
  design_slug: FormControl<string>;
  variant: FormArray<FormGroup<IBlueprintVariantForm>>;
}

// function to set default values for form initialization
export function createDefaultSizeQuantityMatrixForm(): FormGroup<ISizeQuantityMatrixForm> {
  return new FormGroup<ISizeQuantityMatrixForm>({
    ring_size: new FormControl('', [Validators.required]),
    stone_quantity: new FormControl(0, [Validators.required, Validators.min(0)]),
  });
}

/**
 * Creates a default initialized Stone Zone Form Structure
 */
export function createDefaultStoneZoneForm(): FormGroup<IStoneZoneForm> {
  return new FormGroup<IStoneZoneForm>({
    zone_slot_id: new FormControl(null, [Validators.required]),
    zone_name: new FormControl('', [Validators.required]),
    template_id: new FormControl('', [Validators.required]),
    is_dynamic_by_size: new FormControl(false, { nonNullable: true }),
    fixed_quantity: new FormControl(null),
    size_quantity_matrix: new FormArray<FormGroup<ISizeQuantityMatrixForm>>([]),
    selected_size: new FormControl<ISearchableDropdownItem | null>(null),
  });
}

/**
 * Creates a default initialized Allowed Metal item row
 */
export function createDefaultAllowedMetalForm(): FormGroup<IAllowedMetalForm> {
  return new FormGroup<IAllowedMetalForm>({
    metal_purity: new FormControl('', [Validators.required]),
    metal_color: new FormControl('', [Validators.required]),
  });
}

/**
 * Creates a default variant container housing initialized arrays
 */
export function createDefaultBlueprintVariantForm(): FormGroup<IBlueprintVariantForm> {
  return new FormGroup<IBlueprintVariantForm>({
    variant: new FormControl('', [Validators.required]),
    gender: new FormControl(''),
    allowed_metals: new FormArray<FormGroup<IAllowedMetalForm>>([]),
    zone_slots: new FormArray<FormGroup<IStoneZoneForm>>([]),
  });
}
export function createDefaultBlueprintForm(): FormGroup<FormIBlueprint> {
  return new FormGroup<FormIBlueprint>({
    design_slug: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    variant: new FormArray<FormGroup<IBlueprintVariantForm>>([]),
  });
}

export function initializeBlueprintForm(
  configForm: FormGroup<FormIBlueprint>,
  data: IBlueprintData,
): void {
  if (!data || !configForm) return;

  // 1. Clear out existing items from the array safely
  configForm.controls.variant.clear();

  // 2. Set the top-level design slug
  configForm.controls.design_slug.setValue(data.design_slug);

  // 3. Map and push variants
  data.variants.forEach((v: IBlueprintVariant) => {
    // Map Allowed Metals
    const metalFormGroups = v.allowed_metals.map(
      (m) =>
        new FormGroup<IAllowedMetalForm>({
          metal_purity: new FormControl(m.metal_purity),
          metal_color: new FormControl(m.metal_color),
        }),
    );

    // Map Stone Zones
    const zoneFormGroups = v.zone_slots.map((z: IStoneZone) => {
      const matrixFormGroups =
        z.size_quantity_matrix?.map(
          (matrix) =>
            new FormGroup<ISizeQuantityMatrixForm>({
              ring_size: new FormControl(matrix.ring_size),
              stone_quantity: new FormControl(matrix.stone_quantity, [
                Validators.required,
                Validators.min(0),
              ]),
            }),
        ) || [];

      const initialSelectedSize = (matrixFormGroups.length > 0) ? {
        id: 0,
        name: matrixFormGroups[0].controls.ring_size.value || ''
      } : null;

      return new FormGroup<IStoneZoneForm>({
        zone_slot_id: new FormControl(z.zone_slot_id),
        zone_name: new FormControl(z.zone_name),
        template_id: new FormControl(z.template_id),
        is_dynamic_by_size: new FormControl(z.is_dynamic_by_size, { nonNullable: true }),
        fixed_quantity: new FormControl(z.fixed_quantity),
        size_quantity_matrix: new FormArray<FormGroup<ISizeQuantityMatrixForm>>(matrixFormGroups),
        selected_size: new FormControl<ISearchableDropdownItem | null>(initialSelectedSize),
      });
    });

    // Construct the variant group
    const variantGroup = new FormGroup<IBlueprintVariantForm>({
      variant: new FormControl(v.variant, [Validators.required]),
      gender: new FormControl(v.gender),
      allowed_metals: new FormArray<FormGroup<IAllowedMetalForm>>(metalFormGroups),
      zone_slots: new FormArray<FormGroup<IStoneZoneForm>>(zoneFormGroups),
    });

    // Push directly into the reference passed down
    configForm.controls.variant.push(variantGroup);
  });
}
