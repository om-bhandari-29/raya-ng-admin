import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { RingComponentZone, RING_SIZES } from "../../../core/enum/ring-component.enum";
import { ISizeQuantityMatrix } from "../archetypes.response";

export interface IVariant {
    variantId: number;
    variant_name: string;
    target_gender: string;
}


export interface ZoneSlotDetailForm {
    zone_slot_id: FormControl<number | null>;
    dim_l_mm: FormControl<number | null>;
    dim_w_mm: FormControl<number | null>;
    is_dynamic_by_size: FormControl<boolean | null>;
    shape_normalized: FormControl<string | null>;
    size_wt_matrix: FormArray<FormGroup<SizeQuantityMatrixForm>>;
}
export interface VariantUpsertForm {
    variantId: FormControl<number | null>;
    [RingComponentZone.CENTER]: FormArray<FormGroup<ZoneSlotDetailForm>>;
    [RingComponentZone.SHANK]: FormArray<FormGroup<ZoneSlotDetailForm>>;
    [RingComponentZone.HALO]: FormArray<FormGroup<ZoneSlotDetailForm>>;
    [RingComponentZone.ACCENT]: FormArray<FormGroup<ZoneSlotDetailForm>>;
    [RingComponentZone.GALLERY]: FormArray<FormGroup<ZoneSlotDetailForm>>;
}

export const initializeVariantUpsertForm = (): FormGroup<VariantUpsertForm> => {
    const form = new FormGroup<VariantUpsertForm>({
        variantId: new FormControl<number>(0),
        [RingComponentZone.CENTER]: new FormArray<FormGroup<ZoneSlotDetailForm>>([]),
        [RingComponentZone.SHANK]: new FormArray<FormGroup<ZoneSlotDetailForm>>([]),
        [RingComponentZone.HALO]: new FormArray<FormGroup<ZoneSlotDetailForm>>([]),
        [RingComponentZone.ACCENT]: new FormArray<FormGroup<ZoneSlotDetailForm>>([]),
        [RingComponentZone.GALLERY]: new FormArray<FormGroup<ZoneSlotDetailForm>>([]),
    });

    return form;
}

export const initializeZoneSlotDetailForm = (
    data?: Partial<{
        zone_slot_id: number;
        dim_l_mm: number;
        dim_w_mm: number;
        is_dynamic_by_size: boolean;
        shape_normalized: string;
        size_wt_matrix: ISizeQuantityMatrix[];
    }>
): FormGroup<ZoneSlotDetailForm> => {
    let matrixList = data?.size_wt_matrix;
    if (!matrixList || matrixList.length === 0) {
        matrixList = RING_SIZES.map(size => ({
            ring_size: String(size),
            stone_quantity: 1,
            metal_weight: 0
        }));
    }

    return new FormGroup<ZoneSlotDetailForm>({
        zone_slot_id: new FormControl<number | null>(data?.zone_slot_id ?? null),
        dim_l_mm: new FormControl<number | null>(data?.dim_l_mm ?? null),
        dim_w_mm: new FormControl<number | null>(data?.dim_w_mm ?? null),
        is_dynamic_by_size: new FormControl<boolean | null>(
            data?.is_dynamic_by_size ?? null
        ),
        shape_normalized: new FormControl<string | null>(
            data?.shape_normalized ?? null
        ),
        size_wt_matrix: new FormArray<FormGroup<SizeQuantityMatrixForm>>(
            matrixList.map(item =>
                initializeSizeQuantityMatrixForm(item)
            )
        )
    });
};


export interface SizeQuantityMatrixForm {
    ring_size: FormControl<string | null>;
    stone_quantity: FormControl<number | null>;
}

export const initializeSizeQuantityMatrixForm = (
    data?: Partial<ISizeQuantityMatrix>
): FormGroup<SizeQuantityMatrixForm> => {
    return new FormGroup<SizeQuantityMatrixForm>({
        ring_size: new FormControl(data?.ring_size ?? null),
        stone_quantity: new FormControl(data?.stone_quantity ?? null),
    });
};