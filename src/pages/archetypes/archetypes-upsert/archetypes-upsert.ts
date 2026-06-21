import { Component, signal, Signal, WritableSignal, inject, ChangeDetectorRef, OnInit } from '@angular/core';
import { Base } from '../../../core/base/base';
import { ActivatedRoute, Router } from '@angular/router';
import { initializeVariantUpsertForm, initializeZoneSlotDetailForm, initializeSizeQuantityMatrixForm, IVariant, VariantUpsertForm, ZoneSlotDetailForm } from './archetypes-upsert.modal';
import { IGenericResponse } from '../../../core/response/genericResponse.interface';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IArchetypeVariant, ISizeQuantityMatrix, IZoneSlot } from '../archetypes.response';
import { RingComponentZoneArray } from '../../../core/enum/ring-component.enum';
import { RingComponentZoneArrayModel } from '../../../core/models/ringComponentZone.interface';
import { MatDialog } from '@angular/material/dialog';
import { ZoneSlotUpsert } from '../zone-slot-upsert/zone-slot-upsert';
import { BreadcrumbService } from '../../../core/services/breadcrumb.service';
import { PageTitleService } from '../../../core/services/page-title.service';

@Component({
  selector: 'app-archetypes-upsert',
  imports: [ReactiveFormsModule],
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

  public activeZone = signal<string>('ZONE_CENTER');
  constructor(private _activatedRoute: ActivatedRoute) {
    super();
  }

  override ngOnInit(): void {
    let slug: string | null = this._activatedRoute.snapshot.params['design_slug'] ?? null;
    if (slug) {
      this.pageTitleService.setTitle(`Archetype: ${slug}`);
      this.breadcrumb.set([
        { label: 'Archetypes', url: `/${this.appRoutes.ARCHETYPES}` },
        { label: slug },
      ]);
      this.getVaraintBySlug(slug);
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
        size_wt_matrix: slotGroup.get('size_wt_matrix')?.value || []
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
          is_dynamic_by_size: result.is_dynamic_by_size
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

  goBack(): void {
    this.router.navigate([`/${this.appRoutes.ARCHETYPES}`]);
  }
}
