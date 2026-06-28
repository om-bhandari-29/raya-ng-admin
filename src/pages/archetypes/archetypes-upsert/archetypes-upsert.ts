import { Component, signal, Signal, WritableSignal, inject, ChangeDetectorRef, OnInit } from '@angular/core';
import { Base } from '../../../core/base/base';
import { ActivatedRoute, Router } from '@angular/router';
import { initializeVariantUpsertForm, initializeZoneSlotDetailForm, initializeSizeQuantityMatrixForm, IVariant, VariantUpsertForm, ZoneSlotDetailForm } from './archetypes-upsert.modal';
import { IGenericResponse } from '../../../core/response/genericResponse.interface';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IArchetypeVariant, ISizeQuantityMatrix, IZoneSlot } from '../archetypes.response';
import { RingComponentZone, RingComponentZoneArray } from '../../../core/enum/ring-component.enum';
import { RingComponentZoneArrayModel } from '../../../core/models/ringComponentZone.interface';
import { MatDialog } from '@angular/material/dialog';
import { ZoneSlotUpsert } from '../zone-slot-upsert/zone-slot-upsert';
import { BreadcrumbService } from '../../../core/services/breadcrumb.service';
import { PageTitleService } from '../../../core/services/page-title.service';
import { VariantEditModal } from './variant-edit-modal/variant-edit-modal';
import { DecimalPipe } from '@angular/common';

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
  public ringComponentZoneArray: Signal<RingComponentZoneArrayModel[]> = signal(RingComponentZoneArray()).asReadonly();

  private breadcrumb = inject(BreadcrumbService);
  private pageTitleService = inject(PageTitleService);
  private router = inject(Router);

  public activeZone = signal<string>(RingComponentZone.CENTER);
  constructor(private _activatedRoute: ActivatedRoute) {
    super();
  }

  public designSlug: string | null = null;

  override ngOnInit(): void {
    this.designSlug = this._activatedRoute.snapshot.params['design_slug'] ?? null;
    if (this.designSlug) {
      this.pageTitleService.setTitle(`Archetype: ${this.designSlug}`);
      // this.breadcrumb.set([
      //   { label: 'Archetypes', url: `/${this.appRoutes.ARCHETYPES}` },
      //   { label: this.designSlug },
      // ]);
      this.getVaraintBySlug(this.designSlug);
    } else {
      this.toastr.error('Design slug not found');
      this.goBack();
    }
  }

  public getZoneFormArray(zoneName: string): FormArray<FormGroup<ZoneSlotDetailForm>> {
    return this.variantUpsertForm.get(zoneName) as FormArray<FormGroup<ZoneSlotDetailForm>>;
  }

  public getSizeWtMatrixArray(group: any): FormArray {
    return group.get('size_wt_matrix') as FormArray;
  }

  public getZoneAllowedMtl() {
    const vId = this.variantUpsertForm.controls.variantId.value ?? null;
    if (!vId) return;
    this.httpGetPromise<IGenericResponse<IArchetypeVariant>>(this.apiRoutes.products_import.GET_ZONE_ALLOWEDMTL(vId))
      .then((res) => {
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
                  size_wt_matrix
                }
                this.variantUpsertForm.controls[zone].push(initializeZoneSlotDetailForm(parsedV));
              });
            }
          })
        } else {
          this.variantUpsertForm = initializeVariantUpsertForm();
        }
        this.cdr.detectChanges();
      })
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
        variant_id: this.variantUpsertForm.controls.variantId.value
      }
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
          fixed_quantity: result.fixed_quantity
        });
        this.cdr.detectChanges();
      }
    });
  }

  private getVaraintBySlug(design_slug: string) {
    this.httpGetPromise<IGenericResponse<IVariant[]>>(this.apiRoutes.products_import.GET_VARIANT(design_slug))
      .then((res: IGenericResponse<IVariant[]>) => {
        if (res.status) {
          this.designSlugVariant.update(() => res.data);
          this.breadcrumb.set([
            { label: 'Archetypes', url: `/${this.appRoutes.ARCHETYPES}` },
            { label: res.design_slug ?? '' },
          ]);
        }
        else {
          this.designSlugVariant.update(() => []);
        }
        this.cdr.detectChanges();
      }).catch((err) => {
        this.designSlugVariant.update(() => []);
        this.cdr.detectChanges();
      })
  }

  public openVariantEditModal() {
    const vId = this.variantUpsertForm.controls.variantId.value ?? null;
    if (!vId) return;

    const selectedVariant = this.designSlugVariant().find(v => v.variantId === vId);
    if (!selectedVariant) return;

    const dialogRef = this.dialog.open(VariantEditModal, {
      width: '500px',
      disableClose: true,
      data: {
        variant_id: selectedVariant.variantId,
        variant_name: selectedVariant.variant_name,
        target_gender: selectedVariant.target_gender,
        design_slug: this.designSlug
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Update local list
        this.designSlugVariant.update(variants =>
          variants.map(v => v.variantId === vId ? { ...v, variant_name: result.variant_name, target_gender: result.target_gender } : v)
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
        design_slug: this.designSlug ?? ''
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (this.designSlug) {
          this.designSlugVariant.update((oldval) => [...oldval, {
            target_gender: result.target_gender,
            variant_name: result.variant_name,
            variantId: result.variant_id
          }]);
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
        variant_id: this.variantUpsertForm.controls.variantId.value
      }
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
          size_wt_matrix: result.size_wt_matrix || []
        });
        zoneArray.push(newSlotGroup);
        this.cdr.detectChanges();
      }
    });
  }

  goBack(): void {
    this.router.navigate([`/${this.appRoutes.ARCHETYPES}`]);
  }
}
