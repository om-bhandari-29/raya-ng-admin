import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Base } from '../../../core/base/base';
import { IGenericResponse } from '../../../core/response/genericResponse.interface';
import { IBlueprintData } from './product-master-imported-detail.response';
import { createDefaultBlueprintForm, FormIBlueprint, ISizeQuantityMatrixForm, initializeBlueprintForm } from './product-master-imported-detail.model';
import { ISearchableDropdownItem, SearchableDropdown } from '../../../core/component/searchable-dropdown/searchable-dropdown';

@Component({
  selector: 'app-product-master-imported-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SearchableDropdown],
  templateUrl: './product-master-imported-detail.component.html',
  styleUrl: './product-master-imported-detail.component.scss',
})
export class ProductMasterImportedDetailComponent extends Base implements OnInit, OnDestroy {
  // Dependency Injections
  private route = inject(ActivatedRoute);

  // State Variables using Signals for Zoneless stability
  public blueprintData = signal<IBlueprintData | null>(null);
  public calculatedPrice = signal<number>(0);
  public resolvedShankQty = signal<number>(0);
  public isLoadingPrice = signal<boolean>(false);
  public designSlug: string = '';

  private destroy$ = new Subject<void>();
  public configForm: FormGroup<FormIBlueprint> = createDefaultBlueprintForm();
  public activeVariantIndex = 0;

  override ngOnInit(): void {
    super.ngOnInit();
    this.designSlug = this.route.snapshot.paramMap.get('design_slug') || '';
    this.fetchConfigurationRules();
  }

  private async fetchConfigurationRules(): Promise<void> {
    try {
      const res = await this.httpGetPromise<IGenericResponse<IBlueprintData>>(
        this.apiRoutes.products_import.DETAIL(this.designSlug),
      );

      // Handle the API response wrapper correctly
      if (res && res.data) {
        this.blueprintData.set(res.data);
        initializeBlueprintForm(this.configForm, res.data);

        // console.log("first", this.configForm.controls.)
      }
    } catch (err) {
      console.error('Failed to fetch blueprint data', err);
      this.toastr.error('Failed to load product details.');
    }
  }

  public getMatrixOptions(matrix: FormArray<FormGroup<ISizeQuantityMatrixForm>>): ISearchableDropdownItem[] {
    return matrix.controls.map((group, index) => ({
      id: index,
      name: group.controls.ring_size.value || ''
    }));
  }

  /**
   * Local Matrix Resolution & Dynamic Pricing Request Loop
   */
  public async recalculateConfigurationMetrics(): Promise<void> {
    const data = this.blueprintData();
    if (!data) return;

    const formValues = this.configForm.value;

    // Resolve Shank Stone Quantity
    // const shankZone = data.zone_slots.find(z => z.zone_name === 'SHANK');
    // if (shankZone) {
    //   if (shankZone.is_dynamic_by_size && shankZone.size_quantity_matrix) {
    //     const matrixRow = shankZone.size_quantity_matrix.find(row => row.ring_size === String(formValues.ringSize));
    //     this.resolvedShankQty.set(matrixRow ? matrixRow.stone_quantity : 0);
    //   } else {
    //     this.resolvedShankQty.set(shankZone.fixed_quantity ?? 0);
    //   }
    // }

    // Dynamic Pricing Request
    this.isLoadingPrice.set(true);
    const payload = {
      design_slug: this.designSlug,
      ...formValues,
      resolved_shank_qty: this.resolvedShankQty(),
    };

    try {
      const res = await this.httpPostPromise<{ calculatedPrice: number }, any>(
        this.apiRoutes.products_import.CALCULATE_PRICE,
        payload,
        false,
      );
      this.calculatedPrice.set(res.calculatedPrice);
    } catch (err) {
      console.error('Price calculation failed', err);
    } finally {
      this.isLoadingPrice.set(false);
    }
  }

  public onSubmit(){
    
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
