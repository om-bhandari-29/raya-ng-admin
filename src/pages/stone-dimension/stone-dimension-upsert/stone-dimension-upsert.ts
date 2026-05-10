import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Base } from '../../../core/base/base';
import { IGenericResponse } from '../../../core/response/genericResponse.interface';
import { IStoneDimension } from '../stone-dimension.response';
import { APPRoutes } from '../../../core/constant/app-routes';
import { PageTitleService } from '../../../core/services/page-title.service';

interface StoneDimensionForm {
  shape: FormControl<string>;
  stoneName: FormControl<string>;
  cutStyle: FormControl<string>;
  origin: FormControl<string>;
  clarity: FormControl<string>;
  colour: FormControl<string>;
  stoneType: FormControl<string>;
  cutGrade: FormControl<string>;
  countryOrigin: FormControl<string>;
  enhancementTreatment: FormControl<string>;
  sourceFile: FormControl<string>;
  sizeRange: FormControl<string>;
  length: FormControl<number | null>;
  width: FormControl<number | null>;
  height: FormControl<number | null>;
  estimatedWeightInCt: FormControl<number | null>;
  pricePerCt: FormControl<number | null>;
  pricePerCtUsd: FormControl<number | null>;
  is_active: FormControl<boolean>;
}

@Component({
  selector: 'app-stone-dimension-upsert',
  imports: [ReactiveFormsModule],
  templateUrl: './stone-dimension-upsert.html',
  styleUrl: './stone-dimension-upsert.scss',
})
export class StoneDimensionUpsert extends Base implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private pageTitleService = inject(PageTitleService);

  itemId = signal<number>(0);
  isEditMode = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  isSaving = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  form = new FormGroup<StoneDimensionForm>({
    shape: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(100)],
    }),
    stoneName: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(100)],
    }),
    cutStyle: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(100)],
    }),
    origin: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.maxLength(100)],
    }),
    clarity: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.maxLength(100)],
    }),
    colour: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.maxLength(100)],
    }),
    stoneType: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(100)],
    }),
    cutGrade: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.maxLength(100)],
    }),
    countryOrigin: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.maxLength(100)],
    }),
    enhancementTreatment: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.maxLength(200)],
    }),
    sourceFile: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.maxLength(255)],
    }),
    sizeRange: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.maxLength(100)],
    }),
    length: new FormControl<number | null>(null),
    width: new FormControl<number | null>(null),
    height: new FormControl<number | null>(null),
    estimatedWeightInCt: new FormControl<number | null>(null),
    pricePerCt: new FormControl<number | null>(null),
    pricePerCtUsd: new FormControl<number | null>(null),
    is_active: new FormControl<boolean>(true, { nonNullable: true }),
  });

  override ngOnInit(): void {
    super.ngOnInit();
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== '0') {
      this.itemId.set(parseInt(id, 10));
      this.isEditMode.set(true);
      this.pageTitleService.setTitle('Edit Stone Dimension');
      this.loadItem();
    } else {
      this.pageTitleService.setTitle('New Stone Dimension');
    }
  }

  private async loadItem(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    try {
      const res = await this.httpGetPromise<IGenericResponse<IStoneDimension>>(
        this.apiRoutes.stone_dimension.GET_BY_ID(this.itemId()),
      );
      if (res.status) {
        this.form.patchValue({
          shape: res.data.shape,
          stoneName: res.data.stoneName,
          cutStyle: res.data.cutStyle,
          origin: res.data.origin || '',
          clarity: res.data.clarity || '',
          colour: res.data.colour || '',
          stoneType: res.data.stoneType,
          cutGrade: res.data.cutGrade || '',
          countryOrigin: res.data.countryOrigin || '',
          enhancementTreatment: res.data.enhancementTreatment || '',
          sourceFile: res.data.sourceFile || '',
          sizeRange: res.data.sizeRange || '',
          length: res.data.length || null,
          width: res.data.width || null,
          height: res.data.height || null,
          estimatedWeightInCt: res.data.estimatedWeightInCt || null,
          pricePerCt: res.data.pricePerCt || null,
          pricePerCtUsd: res.data.pricePerCtUsd || null,
          is_active: res.data.is_active,
        });
        // Update title with stone name if available
        if (res.data.stoneName) {
          this.pageTitleService.setTitle(res.data.stoneName);
        }
      } else {
        this.errorMessage.set(res.message);
      }
    } catch {
      this.errorMessage.set('Failed to load stone dimension. Please try again.');
    } finally {
      this.isLoading.set(false);
    }
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isSaving.set(true);
    this.errorMessage.set(null);
    try {
      const payload = this.form.getRawValue();
      if (this.isEditMode()) {
        await this.httpPatchPromise<IGenericResponse<IStoneDimension>, typeof payload>(
          this.apiRoutes.stone_dimension.UPDATE(this.itemId()),
          payload,
        );
        this.toastr.success('Stone dimension updated successfully.');
      } else {
        await this.httpPostPromise<IGenericResponse<IStoneDimension>, typeof payload>(
          this.apiRoutes.stone_dimension.CREATE,
          payload,
        );
        this.toastr.success('Stone dimension created successfully.');
      }
      this.router.navigate([`/${APPRoutes.STONE_DIMENSION}`]);
    } catch {
      this.errorMessage.set('Failed to save stone dimension. Please try again.');
    } finally {
      this.isSaving.set(false);
    }
  }

  onCancel(): void {
    this.router.navigate([`/${APPRoutes.STONE_DIMENSION}`]);
  }

  get shapeControl() {
    return this.form.controls.shape;
  }
  get stoneNameControl() {
    return this.form.controls.stoneName;
  }
  get cutStyleControl() {
    return this.form.controls.cutStyle;
  }
  get stoneTypeControl() {
    return this.form.controls.stoneType;
  }
}
