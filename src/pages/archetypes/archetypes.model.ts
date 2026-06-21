import { FormControl, FormGroup } from '@angular/forms';
import { RingComponentZone } from '../../core/enum/ring-component.enum';

export interface ZoneForm {
    shape: FormControl<string | null>;
    stone: FormControl<string | null>;
}

export interface BaseRingForm {
    variantId: FormControl<number | null>;
    variantArchitecture: FormControl<string | null>;
    stoneOriginType: FormControl<string | null>;
    ringSize: FormControl<number | null>;

    [RingComponentZone.CENTER]: FormGroup<ZoneForm>;
    [RingComponentZone.SHANK]: FormGroup<ZoneForm>;
    [RingComponentZone.HALO]: FormGroup<ZoneForm>;
    [RingComponentZone.ACCENT]: FormGroup<ZoneForm>;
    [RingComponentZone.GALLERY]: FormGroup<ZoneForm>;
}



// Helper function to generate a fresh ZoneForm group
function createDefaultZoneForm(): FormGroup<ZoneForm> {
    return new FormGroup<ZoneForm>({
        shape: new FormControl<string | null>(null),
        stone: new FormControl<string | null>(null),
    });
}

// Main factory function for DevotionRingForm
export function createDefaultDevotionRingForm(): FormGroup<BaseRingForm> {
    return new FormGroup<BaseRingForm>({
        variantId: new FormControl<number | null>(null),
        variantArchitecture: new FormControl<string | null>(null),
        stoneOriginType: new FormControl<string | null>(null),
        ringSize: new FormControl<number | null>(null),

        // Dynamically assign the keys using your enum values
        [RingComponentZone.CENTER]: createDefaultZoneForm(),
        [RingComponentZone.SHANK]: createDefaultZoneForm(),
        [RingComponentZone.HALO]: createDefaultZoneForm(),
        [RingComponentZone.ACCENT]: createDefaultZoneForm(),
        [RingComponentZone.GALLERY]: createDefaultZoneForm(),
    });
}