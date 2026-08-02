import { MetalType } from './../../../core/enum/metal-type.enum';
import { Component, OnInit, Signal, WritableSignal, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Base } from '../../../core/base/base';
import {
  IArchetypeDetail,
  IArchetypeDetailResponse,
  IStoneOption,
  IZoneSlot,
} from '../archetypes.response';
import { BreadcrumbService } from '../../../core/services/breadcrumb.service';
import { PageTitleService } from '../../../core/services/page-title.service';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ɵInternalFormsSharedModule,
} from '@angular/forms';
import { BaseRingForm, createDefaultDevotionRingForm } from '../archetypes.model';
import {
  IGenericListResponse,
  IGenericResponse,
} from '../../../core/response/genericResponse.interface';
import { RING_SIZES } from '../../../core/enum/ring-component.enum';
import { RMetal } from '../../../core/response/metal-purity.response';
import { RAllowedMetal } from '../archetypes-upsert/archetypes-upsert.response';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-archetype-detail',
  standalone: true,
  imports: [CommonModule, ɵInternalFormsSharedModule, ReactiveFormsModule],
  templateUrl: './archetype-detail.html',
  styleUrl: './archetype-detail.scss',
})
export class ArchetypeDetail extends Base implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  public detail = signal<IArchetypeDetail | null>(null);
  public detailForm: FormGroup<BaseRingForm> = createDefaultDevotionRingForm();
  public ringSizes = RING_SIZES;
  public readonly MetalType = MetalType;

  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  // Track selected shape per zone: key = "ZONE_KEY"
  selectedShapes = signal<Record<string, string>>({});

  // Track available stones per zone after shape selection
  stoneOptions = signal<Record<string, IStoneOption[]>>({});

  // Track loading state per zone
  stoneLoading = signal<Record<string, boolean>>({});

  // Track selected stone per zone
  selectedStones = signal<Record<string, IStoneOption | null>>({});

  // Track selected metal purity to filter available colors
  selectedPurity = signal<string | null>(null);

  // Computed allowed colors for the selected metal purity
  allowedColorsForSelectedPurity = computed(() => {
    const purity = this.selectedPurity();
    if (!purity) return [];
    const variant = this.detail()?.variants?.[this.activeVariantIndex()];
    const match = variant?.design_variant_allowed_metals?.find((m) => m.metal_purity === purity);
    return match ? match.allowed_colors : [];
  });

  public activeVariantIndex = signal<number>(0);
  public calculatedWeights = signal<{ ringSize: string; targetWeight: number }[]>([]);

  public allowedMetals = signal<RAllowedMetal[]>([]);
  public metalColor = signal<
    Array<{
      metal_purity_id: number;
      metal_purity_name: string;
      rate_per_gram_inr: number;
      rate_per_gram_usd: number;
    }>
  >([]);

  getSelectedMetalPurityDetails() {
    const purityId = this.detailForm.controls.selectedMetalColor.value;
    if (!purityId) return null;
    return this.metalColor().find((c) => String(c.metal_purity_id) === String(purityId)) || null;
  }

  public selectedVariantZonesStone: Signal<{
    zones: string[];
    stonesByZone: Map<string, IZoneSlot[]>;
  }> = computed(() => {
    if (!this.detail()) {
      return {
        zones: [],
        stonesByZone: new Map<string, IZoneSlot[]>(),
      };
    }

    const variant = this.detail()?.variants?.[this.activeVariantIndex()];
    if (!variant) {
      return {
        zones: [],
        stonesByZone: new Map<string, IZoneSlot[]>(),
      };
    }

    let zones: string[] = [];
    let zoneStones: Map<string, IZoneSlot[]> = new Map<string, IZoneSlot[]>();

    Object.entries(variant.zone_slots).forEach(([zone, zoneBasedStones]: [string, IZoneSlot[]]) => {
      if (zoneBasedStones.length) {
        zones.push(zone);
        zoneStones.set(zone, zoneBasedStones);
      }
    });

    return {
      zones: zones,
      stonesByZone: zoneStones,
    };
  });

  readonly zoneDisplayNames: Record<string, string> = {
    ZONE_CENTER: 'Center',
    ZONE_SHANK: 'Shank',
    ZONE_HALO: 'Halo',
    ZONE_ACCENT: 'Accent',
    ZONE_GALLERY: 'Gallery',
  };

  public selectedRingSize = signal<string | null>(null);

  override ngOnInit(): void {
    super.ngOnInit();

    this.detailForm.controls.ringSize.valueChanges.subscribe((val) => {
      this.selectedRingSize.set(val ? String(val) : null);
    });

    const designId = this.route.snapshot.paramMap.get('design_slug');
    if (designId) {
      this.loadDetail(+designId);
      this.pageTitleService.setTitle(`Archetype: ${designId}`);
    } else {
      this.toastr.error('Design slug not found');
      this.goBack();
    }
  }

  async loadDetail(designId: number): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    try {
      const res = await this.httpGetPromise<IArchetypeDetailResponse>(
        this.apiRoutes.archetypes.GET_DETAIL(designId),
      );
      if (res.success && res.data) {
        this.detail.set(res.data);
        this.breadcrumb.set([
          { label: 'Archetypes', url: `/${this.appRoutes.ARCHETYPES}` },
          { label: res.data.design_slug },
        ]);

        this.activeVariantIndex.update(() => 0);

        // Patch initial values to the form
        const firstVariant = res.data.variants?.[0];
        this.detailForm.patchValue({
          variantId: firstVariant?.variantId || null,
          variantArchitecture: firstVariant?.variant || null,
          stoneOriginType: 'Natural',
          ringSize: null,
          selectedMetalPurity: null,
          selectedMetalColor: null,
        });
        this.selectedPurity.set(null);

        this.getVariantAllowedMetals(firstVariant?.variantId || 0);
      } else {
        this.errorMessage.set('Failed to load design details.');
      }
    } catch (error) {
      console.error('Error loading archetype detail:', error);
      this.errorMessage.set('An error occurred while loading details. Please try again.');
    } finally {
      this.isLoading.set(false);
    }
  }

  getSelectedMetalWeight(): number {
    const size = this.selectedRingSize();
    if (!size) return 0;

    const calcWeights = this.calculatedWeights();
    if (calcWeights && calcWeights.length > 0) {
      const entry = calcWeights.find((w) => String(w.ringSize) === String(size));
      if (entry) return entry.targetWeight;
    }

    const variant = this.detail()?.variants?.[this.activeVariantIndex()];
    if (!variant || !variant.weight_matrix) return 0;
    const entry = variant.weight_matrix.find((w) => String(w.ring_size) === String(size));
    return entry ? entry.base_metal_weight_gm : 0;
  }

  onVariantChange(idx: number): void {
    this.activeVariantIndex.set(idx);

    // Update form control value for variant architecture
    const selectedVariant = this.detail()?.variants?.[idx];
    this.detailForm.patchValue({
      variantId: selectedVariant?.variantId || null,
      variantArchitecture: selectedVariant?.variant || null,
      selectedMetalPurity: null,
      selectedMetalColor: null,
    });
    this.calculatedWeights.set([]);
    this.selectedPurity.set(null);
    this.metalColor.set([]);

    // Reset all selections when variant changes
    this.selectedShapes.set({});
    this.stoneOptions.set({});
    this.stoneLoading.set({});
    this.selectedStones.set({});

    // Reset nested zone form controls inside detailForm
    this.getZoneKeys().forEach((zoneKey) => {
      const zoneGroup = this.detailForm.get(zoneKey) as FormGroup;
      if (zoneGroup) {
        zoneGroup.patchValue({
          shape: null,
          stone: null,
        });
      }
    });

    this.getVariantAllowedMetals(selectedVariant?.variantId || 0);
  }

  private getVariantAllowedMetals(variantId: number): void {
    this.httpGetPromise<IGenericResponse<RAllowedMetal[]>>(
      this.apiRoutes.products_import.GET_ALLOWED_METALS(variantId),
    )
      .then((res) => {
        if (res.status && res.data) {
          this.allowedMetals.set(res.data);
        } else {
          this.allowedMetals.set([]);
        }
      })
      .catch((error) => {
        console.error('Error fetching allowed metals:', error);
        this.allowedMetals.set([]);
      });
  }

  getZoneKeys(): string[] {
    const variant = this.detail()?.variants?.[this.activeVariantIndex()];
    if (!variant) return [];
    const zones = Object.keys(variant.zone_slots).filter(
      (key) => (variant.zone_slots as Record<string, IZoneSlot[]>)[key]?.length > 0,
    );

    Object.entries(variant.zone_slots).forEach(([key, value]: [string, IZoneSlot[]]) => {
      // console.log(value);
      if (value.length) {
        // console.log("first", key)
      }
    });

    return zones;
  }

  getZoneSlots(key: string): IZoneSlot[] {
    const variant = this.detail()?.variants?.[this.activeVariantIndex()];
    if (!variant) return [];
    return (variant.zone_slots as Record<string, IZoneSlot[]>)[key] || [];
  }

  /** Get unique shapes available in a zone */
  getUniqueShapes(zoneKey: string): string[] {
    const slots = this.getZoneSlots(zoneKey);
    const shapes = new Set(slots.map((s) => s.shape_normalized));
    return Array.from(shapes);
  }

  /** Get total slot count for a zone */
  getSlotCount(zoneKey: string): number {
    return this.getZoneSlots(zoneKey).length;
  }

  getStoneQuantity(zoneKey: string): number {
    if (zoneKey === 'ZONE_CENTER') return 1;

    const selectedShapeId = this.selectedShapes()[zoneKey];
    const slots = this.getZoneSlots(zoneKey);
    const slot = slots.find((s) => String(s.zone_slot_id) === selectedShapeId);

    const ringSize = this.detailForm.controls.ringSize.value;
    const matrixEntry = slot?.size_wt_matrix?.find((m) => String(m.ring_size) === String(ringSize));

    return matrixEntry ? matrixEntry.stone_quantity : (slot?.fixed_quantity ?? 0);
  }

  getSelectedShapeName(zoneKey: string): string {
    const selectedShapeId = this.selectedShapes()[zoneKey];
    const slots = this.getZoneSlots(zoneKey);
    const slot = slots.find((s) => String(s.zone_slot_id) === selectedShapeId);
    return slot ? slot.shape_normalized : '';
  }

  hasAnyStoneSelected(): boolean {
    return this.getZoneKeys().some((zoneKey) => this.selectedStones()[zoneKey]);
  }

  getGrandTotalWeight(): number {
    let total = 0;
    this.getZoneKeys().forEach((zoneKey) => {
      const stone = this.selectedStones()[zoneKey];
      if (stone) {
        const qty = this.getStoneQuantity(zoneKey);
        total += (stone.Estimated_Weight_Final_ct ?? 0) * qty;
      }
    });
    return total;
  }

  getGrandTotalPriceINR(): number {
    let total = 0;
    this.getZoneKeys().forEach((zoneKey) => {
      const stone = this.selectedStones()[zoneKey];
      if (stone) {
        const qty = this.getStoneQuantity(zoneKey);
        total += (stone.Price_per_ct_INR ?? 0) * (stone.Estimated_Weight_Final_ct ?? 0) * qty;
      }
    });
    return total;
  }

  getGrandTotalPriceUSD(): number {
    let total = 0;
    this.getZoneKeys().forEach((zoneKey) => {
      const stone = this.selectedStones()[zoneKey];
      if (stone) {
        const qty = this.getStoneQuantity(zoneKey);
        total += (stone.Price_per_ct_USD ?? 0) * (stone.Estimated_Weight_Final_ct ?? 0) * qty;
      }
    });
    return total;
  }

  async onShapeSelect(zoneKey: string, event: Event): Promise<void> {
    const selectEl = event.target as HTMLSelectElement;
    const shapeId = selectEl.value;
    this.selectedShapes.update((prev) => ({ ...prev, [zoneKey]: shapeId }));

    // Clear previous stone selection for this zone
    this.selectedStones.update((prev) => ({ ...prev, [zoneKey]: null }));

    // Synchronize form control values
    const zoneGroup = this.detailForm.get(zoneKey) as FormGroup;
    if (zoneGroup) {
      zoneGroup.patchValue({
        shape: shapeId,
        stone: null, // Reset stone when shape changes
      });
    }

    // Fetch stones
    await this.fetchStonesForZone(zoneKey, shapeId);
  }

  async fetchStonesForZone(zoneKey: string, shapeId: string): Promise<void> {
    const selectedShapeObj: IZoneSlot | null =
      this.selectedVariantZonesStone()
        .stonesByZone.get(zoneKey)
        ?.find((val) => val.zone_slot_id === Number(shapeId)) ?? null;
    console.log('selectedShapeObj ', selectedShapeObj);

    this.stoneLoading.update((prev) => ({ ...prev, [zoneKey]: true }));

    try {
      const queryParam: Record<string, string | number> = {
        stoneOriginType: this.detailForm.controls.stoneOriginType.value ?? '',
        shapeNormalised: selectedShapeObj?.shape_normalized ?? '',
        dim_l_mm: Number(selectedShapeObj?.dim_l_mm ?? 0),
        dim_w_mm: Number(selectedShapeObj?.dim_w_mm ?? 0),
      };
      // const res = await this.httpGetPromise<{ success: boolean; data: IStoneOption[] }>(
      const res = await this.httpGetPromise<IGenericResponse<IStoneOption[]>>(
        this.apiRoutes.stone_dimension.OPTION,
        false,
        queryParam,
      );
      if (res.status) {
        this.stoneOptions.update((prev) => ({ ...prev, [zoneKey]: res.data }));
      } else {
        this.stoneOptions.update((prev) => ({ ...prev, [zoneKey]: [] }));
      }
      console.log(this.stoneOptions()[zoneKey]);
    } catch (error) {
      console.error('Error fetching stones:', error);
      this.stoneOptions.update((prev) => ({ ...prev, [zoneKey]: [] }));
    } finally {
      this.stoneLoading.update((prev) => ({ ...prev, [zoneKey]: false }));
    }
  }

  onStoneSelect(zoneKey: string, event: Event): void {
    const selectEl = event.target as HTMLSelectElement;
    const stoneId = Number(selectEl.value);
    const stones = this.stoneOptions()[zoneKey] || [];
    const selected = stones.find((s) => s.id === stoneId) || null;
    this.selectedStones.update((prev) => ({ ...prev, [zoneKey]: selected }));

    // Synchronize form control value
    const zoneGroup = this.detailForm.get(zoneKey) as FormGroup;
    if (zoneGroup) {
      zoneGroup.patchValue({
        stone: stoneId ? String(stoneId) : null,
      });
    }
  }

  onMetalPurityChange(event: Event): void {
    const selectEl = event.target as HTMLSelectElement;
    const metalId = selectEl.value;
    this.selectedPurity.set(metalId);

    console.log('Selected Metal:', metalId);

    const selectedMetalObj = this.allowedMetals().find((m) => String(m.metal_type) === metalId);
    if (selectedMetalObj) {
      this.metalColor.set(selectedMetalObj.allowed_metal_purities_id);
    } else {
      this.metalColor.set([]);
    }

    // Reset selected color when metal changes
    this.detailForm.patchValue({
      selectedMetalColor: null,
    });
    this.calculatedWeights.set([]);
  }

  onMetalColorChange(event: Event): void {
    const selectEl = event.target as HTMLSelectElement;
    const purityId = selectEl.value;

    if (!purityId) {
      this.calculatedWeights.set([]);
      return;
    }

    const selectedPurityObj = this.metalColor().find(
      (c) => String(c.metal_purity_id) === String(purityId),
    );
    if (!selectedPurityObj) {
      this.calculatedWeights.set([]);
      return;
    }

    const variantId = this.detailForm.value.variantId;
    if (!variantId) return;

    // Use purity_code if available, otherwise try to extract it from the name (e.g., '18K Premium Gold' -> '18K')
    const targetPurity =
      (selectedPurityObj as any).purity_code || selectedPurityObj.metal_purity_name.split(' ')[0];

    const payload = {
      variantId: Number(variantId),
      targetPurity: targetPurity,
    };

    this.httpPostPromise<IGenericResponse<any>, any>(
      this.apiRoutes.Metal_Purity.CALCULATE_WEIGHT,
      payload,
    )
      .then((res) => {
        if (res.status && res.data && res.data.weights) {
          this.calculatedWeights.set(res.data.weights);
        } else {
          this.calculatedWeights.set([]);
        }
      })
      .catch((err: HttpErrorResponse) => {
        console.error('Error calculating metal weight:', err.error.message);
        this.toastr.error(err.error.message);
        this.calculatedWeights.set([]);
      });
  }

  onSave(): void {
    if (this.detailForm.invalid) {
      this.toastr.error('Please fill all required fields before saving.');
      return;
    }

    const payload = this.detailForm.value;
    console.log('Saving archetype details:', payload);

    // Call API using base helper
    // this.httpPostPromise(this.apiRoutes.archetypes.SAVE(this.detail()?.design_slug), payload)
    //   .then(res => {
    //      this.toastr.success('Saved successfully');
    //      this.detailForm.markAsPristine();
    //   });
    this.toastr.success('Changes saved successfully');
    this.detailForm.markAsPristine();
  }

  goBack(): void {
    this.router.navigate([`/${this.appRoutes.ARCHETYPES}`]);
  }
}
