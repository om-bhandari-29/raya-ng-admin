import {
  Component,
  signal,
  Signal,
  WritableSignal,
  inject,
  ChangeDetectorRef,
  OnInit,
} from '@angular/core';
import { Base } from '../../../core/base/base';
import { ActivatedRoute, Router } from '@angular/router';
import {
  initializeVariantUpsertForm,
  initializeZoneSlotDetailForm,
  initializeSizeQuantityMatrixForm,
  IVariant,
  VariantUpsertForm,
  ZoneSlotDetailForm,
} from './archetypes-upsert.modal';
import { IGenericResponse } from '../../../core/response/genericResponse.interface';
import { FormArray, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  IArchetypeVariant,
  ISizeQuantityMatrix,
  IZoneSlot,
  IMetalPurity,
  IAllowedMetal,
  ISaveMetalPurity,
} from '../archetypes.response';
import { RingComponentZone, RingComponentZoneArray } from '../../../core/enum/ring-component.enum';
import { RingComponentZoneArrayModel } from '../../../core/models/ringComponentZone.interface';
import { MatDialog } from '@angular/material/dialog';
import { ZoneSlotUpsert } from '../zone-slot-upsert/zone-slot-upsert';
import { BreadcrumbService } from '../../../core/services/breadcrumb.service';
import { PageTitleService } from '../../../core/services/page-title.service';
import { VariantEditModal } from './variant-edit-modal/variant-edit-modal';
import { DecimalPipe } from '@angular/common';
import { MetalPurity } from '../../../core/enum/metal-purity.enum';
import { MetalColor } from '../../../core/enum/metal-color.enum';
import { RMetal } from '../../../core/response/metal-purity.response';

@Component({
  selector: 'app-archetypes-upsert',
  imports: [ReactiveFormsModule, DecimalPipe],
  templateUrl: './archetypes-upsert.html',
  styleUrl: './archetypes-upsert.scss',
})
export class ArchetypesUpsert extends Base implements OnInit {
  private dialog = inject(MatDialog);
  private cdr = inject(ChangeDetectorRef);

  public designSlugVariant: WritableSignal<IVariant[]> = signal([]);
  public variantUpsertForm: FormGroup<VariantUpsertForm> = initializeVariantUpsertForm();
  public ringComponentZoneArray: Signal<RingComponentZoneArrayModel[]> =
    signal(RingComponentZoneArray()).asReadonly();

  private router = inject(Router);

  public activeZone = signal<string>(RingComponentZone.CENTER);
  public activeTab = signal<'metal' | 'stone'>('metal');
  public allowedMetals = signal<ISaveMetalPurity[]>([]);
  public metalPurity: WritableSignal<RMetal[]> = signal([]);
  public metalColor: WritableSignal<RMetal[]> = signal([]);


  public metalSpecsForm = new FormGroup<Record<string, FormGroup>>({});

  constructor(private _activatedRoute: ActivatedRoute) {
    super();
  }

  public designSlug: string | null = null;

  override ngOnInit(): void {
    this.designSlug = this._activatedRoute.snapshot.params['design_slug'] ?? null;
    if (this.designSlug) {
      this.pageTitleService.setTitle(`Archetype: ${this.designSlug}`);
      this.getVaraintBySlug(this.designSlug);
    } else {
      this.toastr.error('Design slug not found');
      this.goBack();
    }

    this.getMetalPurityCombo(this.apiRoutes.Metal_Master.GET_COMBO).then((purityData) => {
      this.metalPurity.set(purityData);
      return this.getMetalPurityCombo(this.apiRoutes.Metal_Purity.GET_COMBO);
    }).then((colorData) => {
      this.metalColor.set(colorData);
      this.initDynamicMetalSpecsForm();
    });
  }

  private initDynamicMetalSpecsForm() {
    const purityList = this.metalPurity();
    const colorList = this.metalColor();
    
    // Clear and build dynamic form controls
    // const newFormGroupConfig: Record<string, FormGroup> = {};
    // purityList.forEach((purity) => {
    //   const colorGroupConfig: Record<string, FormControl<boolean>> = {};
    //   colorList.forEach((color) => {
    //     colorGroupConfig[color.code] = new FormControl<boolean>(false, { nonNullable: true });
    //   });
    //   newFormGroupConfig[purity.code] = new FormGroup(colorGroupConfig);
    // });

    // this.metalSpecsForm = new FormGroup(newFormGroupConfig);
  }

  public getZoneFormArray(zoneName: string): FormArray<FormGroup<ZoneSlotDetailForm>> {
    return this.variantUpsertForm.get(zoneName) as FormArray<FormGroup<ZoneSlotDetailForm>>;
  }

  public getSizeWtMatrixArray(group: any): FormArray {
    return group.get('size_wt_matrix') as FormArray;
  }

  public getVariantAllowedMetals(vId: number | string) {
    this.httpGetPromise<IGenericResponse<any[]>>(
      this.apiRoutes.products_import.GET_ALLOWED_METALS(vId),
    )
      .then((res) => {
        if (res.status && res.data) {
          const mappedMetals: ISaveMetalPurity[] = [];
          res.data.forEach((item) => {
            if (item.allowed_color_ids) {
              mappedMetals.push({
                metal_purity: String(item.metal_purity_id),
                metal_color: item.allowed_color_ids.map(String),
              });
            }
          });
          this.allowedMetals.set(mappedMetals);

          // Reset the form
          this.metalSpecsForm.reset();

          // res.data.forEach((item) => {
          //   const purityObj = this.metalPurity().find(p => String(p.id) === String(item.metal_purity_id));
          //   const purityKey = purityObj ? purityObj.code : '';

          //   if (purityKey) {
          //     const purityGroup = this.metalSpecsForm.get(purityKey) as FormGroup;
          //     if (purityGroup && item.allowed_color_ids) {
          //       item.allowed_color_ids.forEach((colorVal: any) => {
          //         const colorObj = this.metalColor().find(c => String(c.id) === String(colorVal));
          //         const colorKey = colorObj ? colorObj.code : '';
                  
          //         if (colorKey) {
          //           const colorControl = purityGroup.get(colorKey) as FormControl;
          //           if (colorControl) {
          //             colorControl.setValue(true);
          //           }
          //         }
          //       });
          //     }
          //   }
          // });
        } else {
          this.allowedMetals.set([]);
          this.metalSpecsForm.reset();
        }
        this.cdr.detectChanges();
      })
      .catch((err) => {
        this.allowedMetals.set([]);
        this.metalSpecsForm.reset();
        this.cdr.detectChanges();
      });
  }

  public getZoneAllowedMtl() {
    const vId = this.variantUpsertForm.controls.variantId.value ?? null;
    if (!vId) {
      this.allowedMetals.set([]);
      this.metalSpecsForm.reset();
      return;
    }

    this.getVariantAllowedMetals(vId);

    this.httpGetPromise<IGenericResponse<IArchetypeVariant>>(
      this.apiRoutes.products_import.GET_ZONE_ALLOWEDMTL(vId),
    ).then((res) => {
      if (res.status) {
        // Clear existing form arrays before pushing new items
        Object.keys(this.variantUpsertForm.controls).forEach((key) => {
          if (key !== 'variantId') {
            const array = this.variantUpsertForm.get(key) as FormArray;
            if (array) {
              array.clear();
            }
          }
        });

        Object.keys(res.data.zone_slots).forEach((val) => {
          const zone = val as keyof typeof res.data.zone_slots;
          const zoneSlot: Array<IZoneSlot> = res.data.zone_slots[zone];
          if (zoneSlot.length) {
            zoneSlot.forEach((value: IZoneSlot) => {
              const size_wt_matrix: Array<ISizeQuantityMatrix> = value.size_wt_matrix ?? [];
              const parsedV = {
                ...value,
                dim_w_mm: Number(value.dim_w_mm),
                dim_l_mm: Number(value.dim_l_mm),
                size_wt_matrix,
              };
              this.variantUpsertForm.controls[zone].push(initializeZoneSlotDetailForm(parsedV));
            });
          }
        });
      } else {
        this.variantUpsertForm = initializeVariantUpsertForm();
      }
      this.cdr.detectChanges();
    });
  }

  public saveMetalSpecs() {
    const vId = this.variantUpsertForm.controls.variantId.value ?? null;
    if (!vId) {
      this.toastr.error('No variant selected');
      return;
    }

    const allowedMetalsPayload: any[] = [];
    const formValue = this.metalSpecsForm.getRawValue();

    // Iterate dynamically and map codes to IDs
    // this.metalPurity().forEach((purity) => {
    //   const purityGroupValue = formValue[purity.code];
    //   if (purityGroupValue) {
    //     const allowedColors: number[] = [];
    //     this.metalColor().forEach((color) => {
    //       if (purityGroupValue[color.code]) {
    //         allowedColors.push(color.id);
    //       }
    //     });
    //     if (allowedColors.length > 0) {
    //       allowedMetalsPayload.push({
    //         metal_purity: purity.id,
    //         metal_color: allowedColors,
    //       });
    //     }
    //   }
    // });

    console.log("allowedMetalsPayload ", allowedMetalsPayload);
    // return;

    this.httpPostPromise<IGenericResponse<null>, any>(
      this.apiRoutes.products_import.UPDATE_VARIANT_ALLOWED_METALS,
      {
        variant_id: vId,
        allowed_metals: allowedMetalsPayload,
      },
    )
      .then((res) => {
        if (res.status) {
          this.allowedMetals.set(allowedMetalsPayload);
          this.toastr.success('Metal specifications updated successfully');
          this.activeTab.update(() => 'stone');
        } else {
          this.toastr.error(res.message || 'Failed to update metal specifications');
        }
        this.cdr.detectChanges();
      })
      .catch((err) => {
        this.toastr.error(err.message || 'An error occurred while saving specifications');
      });
  }

  public openEditModal(index: number) {
    const slotGroup = this.getZoneFormArray(this.activeZone()).at(index);
    const dialogRef = this.dialog.open(ZoneSlotUpsert, {
      width: '600px',
      disableClose: true,
      data: {
        zone_slot_id: slotGroup.get('zone_slot_id')?.value,
        shape_normalized: slotGroup.get('shape_normalized')?.value,
        dim_l_mm: slotGroup.get('dim_l_mm')?.value,
        dim_w_mm: slotGroup.get('dim_w_mm')?.value,
        is_dynamic_by_size: slotGroup.get('is_dynamic_by_size')?.value,
        size_wt_matrix: slotGroup.get('size_wt_matrix')?.value || [],
        zone_type: this.activeZone(),
        fixed_quantity: slotGroup.get('fixed_quantity')?.value,
        variant_id: this.variantUpsertForm.controls.variantId.value,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const matrixArray = slotGroup.get('size_wt_matrix') as FormArray;
        matrixArray.clear();
        if (result.size_wt_matrix && result.size_wt_matrix.length > 0) {
          result.size_wt_matrix.forEach((item: any) => {
            matrixArray.push(initializeSizeQuantityMatrixForm(item));
          });
        }
        slotGroup.patchValue({
          shape_normalized: result.shape_normalized,
          dim_l_mm: result.dim_l_mm,
          dim_w_mm: result.dim_w_mm,
          is_dynamic_by_size: result.is_dynamic_by_size,
          fixed_quantity: result.fixed_quantity,
        });
        this.cdr.detectChanges();
      }
    });
  }

  private getVaraintBySlug(design_slug: string) {
    this.httpGetPromise<IGenericResponse<IVariant[]>>(
      this.apiRoutes.products_import.GET_VARIANT(design_slug),
    )
      .then((res: IGenericResponse<IVariant[]>) => {
        if (res.status) {
          this.designSlugVariant.update(() => res.data);
          this.breadcrumb.set([
            { label: 'Archetypes', url: `/${this.appRoutes.ARCHETYPES}` },
            { label: res.design_slug ?? '' },
          ]);
        } else {
          this.designSlugVariant.update(() => []);
        }
        this.cdr.detectChanges();
      })
      .catch((err) => {
        this.designSlugVariant.update(() => []);
        this.cdr.detectChanges();
      });
  }

  public openVariantEditModal() {
    const vId = this.variantUpsertForm.controls.variantId.value ?? null;
    if (!vId) return;

    const selectedVariant = this.designSlugVariant().find((v) => v.variantId === vId);
    if (!selectedVariant) return;

    const dialogRef = this.dialog.open(VariantEditModal, {
      width: '500px',
      disableClose: true,
      data: {
        variant_id: selectedVariant.variantId,
        variant_name: selectedVariant.variant_name,
        target_gender: selectedVariant.target_gender,
        design_slug: this.designSlug,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Update local list
        this.designSlugVariant.update((variants) =>
          variants.map((v) =>
            v.variantId === vId
              ? { ...v, variant_name: result.variant_name, target_gender: result.target_gender }
              : v,
          ),
        );
        this.toastr.success('Variant details updated successfully');
        this.cdr.detectChanges();
      }
    });
  }

  public openAddVariantModal() {
    const dialogRef = this.dialog.open(VariantEditModal, {
      width: '500px',
      disableClose: true,
      data: {
        variant_id: 0,
        variant_name: '',
        target_gender: '',
        design_slug: this.designSlug ?? '',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (this.designSlug) {
          this.designSlugVariant.update((oldval) => [
            ...oldval,
            {
              target_gender: result.target_gender,
              variant_name: result.variant_name,
              variantId: result.variant_id,
            },
          ]);
        }
        this.toastr.success('Variant created successfully');
        this.cdr.detectChanges();
      }
    });
  }

  public openAddStoneModal() {
    const dialogRef = this.dialog.open(ZoneSlotUpsert, {
      width: '600px',
      disableClose: true,
      data: {
        zone_slot_id: 0,
        shape_normalized: '',
        dim_l_mm: null,
        dim_w_mm: null,
        is_dynamic_by_size: this.activeZone() !== RingComponentZone.CENTER,
        size_wt_matrix: [],
        zone_type: this.activeZone(),
        fixed_quantity: null,
        variant_id: this.variantUpsertForm.controls.variantId.value,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const zoneArray = this.getZoneFormArray(this.activeZone());
        const newSlotGroup = initializeZoneSlotDetailForm({
          zone_slot_id: result.zone_slot_id || 0,
          shape_normalized: result.shape_normalized,
          dim_l_mm: result.dim_l_mm,
          dim_w_mm: result.dim_w_mm,
          is_dynamic_by_size: result.is_dynamic_by_size,
          fixed_quantity: result.fixed_quantity,
          size_wt_matrix: result.size_wt_matrix || [],
        });
        zoneArray.push(newSlotGroup);
        this.cdr.detectChanges();
      }
    });
  }

  private getMetalPurityCombo(api: string): Promise<RMetal[]> {
    return this.httpGetPromise<IGenericResponse<RMetal[]>>(api)
      .then((res) => {
        if (res.status && res.data) {
          return res.data;
        }
        return [];
      })
      .catch(() => {
        return [];
      });
  }

  goBack(): void {
    this.router.navigate([`/${this.appRoutes.ARCHETYPES}`]);
  }
}
