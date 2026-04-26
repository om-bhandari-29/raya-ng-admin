import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Base } from '../../../core/base/base';
import { IGenericResponse } from '../../../core/response/genericResponse.interface';
import { IItem } from '../item.response';
import { IGroupItem } from '../../group-item/group-item.response';
import { IProductMaster } from '../../product-master/product-master.response';
import { IUom } from '../../uom/uom.response';
import { IGstHsnCode } from '../../gst-hsn-code/gst-hsn-code.response';
import { IItemAttribute } from '../../item-attribute/item-attribute.response';
import { IStoneMaster } from '../../stone-master/stone-master.response';
import { ItemDropdowns } from '../item.models';
import { ItemTab, ITEM_TABS } from '../../../core/enum/item-tab.enum';
import { DetailsTab, ItemDetailsPayload } from './tabs/details-tab/details-tab';
import { InventoryTab, ItemInventoryPayload } from './tabs/inventory-tab/inventory-tab';
import { VariantsTab, ItemVariantsPayload } from './tabs/variants-tab/variants-tab';
import { StoneDetailsTab, ItemStoneDetailsPayload } from './tabs/stone-details-tab/stone-details-tab';

@Component({
  selector: 'app-item-upsert',
  imports: [DetailsTab, InventoryTab, VariantsTab, StoneDetailsTab],
  templateUrl: './item-upsert.html',
  styleUrl: './item-upsert.scss',
})
export class ItemUpsert extends Base implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  readonly ItemTab = ItemTab;
  readonly tabs = ITEM_TABS;

  isEditMode = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  isSaving = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  activeTab = signal<ItemTab>(ItemTab.DETAILS);
  itemId = signal<number>(0);
  item = signal<IItem | null>(null);
  dropdowns = signal<ItemDropdowns | null>(null);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam && idParam !== 'new') {
      this.itemId.set(+idParam);
      this.isEditMode.set(true);
      this.loadItem();
    }
    this.loadDropdowns();
  }

  setTab(tab: ItemTab): void { this.activeTab.set(tab); }

  private goNextTab(): void {
    const idx = this.tabs.findIndex(t => t.key === this.activeTab());
    if (idx < this.tabs.length - 1) {
      this.activeTab.set(this.tabs[idx + 1].key);
    }
  }

  // ── Per-tab save handlers ──────────────────────────────────────────────────

  async onSaveDetails(payload: ItemDetailsPayload): Promise<void> {
    this.isSaving.set(true);
    this.errorMessage.set(null);
    try {
      if (this.isEditMode()) {
        await this.httpPatchPromise<IGenericResponse<IItem>, ItemDetailsPayload>(
          this.apiRoutes.item.UPDATE(this.itemId()), payload
        );
        this.toastr.success('Details saved.');
        this.goNextTab();
      } else {
        const res = await this.httpPostPromise<IGenericResponse<IItem>, ItemDetailsPayload>(
          this.apiRoutes.item.CREATE, payload
        );
        if (res.status) {
          this.itemId.set(res.data.id);
          this.isEditMode.set(true);
          this.item.set(res.data);
          // Update URL without navigation so the user stays on the page
          this.router.navigate([this.appRoutes.ITEM, res.data.id], { replaceUrl: true });
          this.toastr.success('Item created. You can now fill in the other tabs.');
          this.goNextTab();
        }
      }
    } catch {
      this.errorMessage.set('Failed to save details. Please try again.');
    } finally {
      this.isSaving.set(false);
    }
  }

  async onSaveInventory(payload: ItemInventoryPayload): Promise<void> {
    if (!this.isEditMode()) {
      this.toastr.warning('Please save the Details tab first.');
      this.setTab(ItemTab.DETAILS);
      return;
    }
    this.isSaving.set(true);
    this.errorMessage.set(null);
    try {
      await this.httpPatchPromise<IGenericResponse<IItem>, ItemInventoryPayload>(
        this.apiRoutes.item.UPDATE(this.itemId()), payload
      );
      this.toastr.success('Inventory saved.');
      this.goNextTab();
    } catch {
      this.errorMessage.set('Failed to save inventory. Please try again.');
    } finally {
      this.isSaving.set(false);
    }
  }

  async onSaveVariants(payload: ItemVariantsPayload): Promise<void> {
    if (!this.isEditMode()) {
      this.toastr.warning('Please save the Details tab first.');
      this.setTab(ItemTab.DETAILS);
      return;
    }
    this.isSaving.set(true);
    this.errorMessage.set(null);
    try {
      await this.httpPatchPromise<IGenericResponse<IItem>, ItemVariantsPayload>(
        this.apiRoutes.item.UPDATE(this.itemId()), payload
      );
      this.toastr.success('Variants saved.');
      this.goNextTab();
    } catch {
      this.errorMessage.set('Failed to save variants. Please try again.');
    } finally {
      this.isSaving.set(false);
    }
  }

  async onSaveStoneDetails(payload: ItemStoneDetailsPayload): Promise<void> {
    if (!this.isEditMode()) {
      this.toastr.warning('Please save the Details tab first.');
      this.setTab(ItemTab.DETAILS);
      return;
    }
    this.isSaving.set(true);
    this.errorMessage.set(null);
    try {
      await this.httpPatchPromise<IGenericResponse<IItem>, ItemStoneDetailsPayload>(
        this.apiRoutes.item.UPDATE(this.itemId()), payload
      );
      this.toastr.success('Stone details saved.');
      this.goNextTab();
    } catch {
      this.errorMessage.set('Failed to save stone details. Please try again.');
    } finally {
      this.isSaving.set(false);
    }
  }

  // ── Data loading ───────────────────────────────────────────────────────────

  private async loadDropdowns(): Promise<void> {
    try {
      const [groups, products, uoms, hsn, attrs, families, clarities, shapes] = await Promise.all([
        this.httpGetPromise<IGenericResponse<IGroupItem[]>>(this.apiRoutes.item_group.GET_ALL),
        this.httpGetPromise<IGenericResponse<IProductMaster[]>>(this.apiRoutes.product_master.GET_ALL),
        this.httpGetPromise<IGenericResponse<IUom[]>>(this.apiRoutes.uom.GET_ALL),
        this.httpGetPromise<IGenericResponse<IGstHsnCode[]>>(this.apiRoutes.gst_hsn_code.GET_ALL),
        this.httpGetPromise<IGenericResponse<IItemAttribute[]>>(this.apiRoutes.item_attribute.GET_ALL),
        this.httpGetPromise<IGenericResponse<IStoneMaster[]>>(this.apiRoutes.stone_family.GET_ALL),
        this.httpGetPromise<IGenericResponse<IStoneMaster[]>>(this.apiRoutes.stone_clarity.GET_ALL),
        this.httpGetPromise<IGenericResponse<IStoneMaster[]>>(this.apiRoutes.stone_shape.GET_ALL),
      ]);
      this.dropdowns.set({
        itemGroups: groups.status ? groups.data : [],
        productMasters: products.status ? products.data : [],
        uoms: uoms.status ? uoms.data : [],
        hsnCodes: hsn.status ? hsn.data : [],
        itemAttributes: attrs.status ? attrs.data : [],
        stoneFamilies: families.status ? families.data : [],
        stoneClarities: clarities.status ? clarities.data : [],
        stoneShapes: shapes.status ? shapes.data : [],
      });
    } catch {
      // non-critical
    }
  }

  private async loadItem(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    try {
      const res = await this.httpGetPromise<IGenericResponse<IItem>>(
        this.apiRoutes.item.GET_BY_ID(this.itemId())
      );
      if (res.status) {
        this.item.set(res.data);
      } else {
        this.errorMessage.set(res.message);
      }
    } catch {
      this.errorMessage.set('Failed to load item. Please try again.');
    } finally {
      this.isLoading.set(false);
    }
  }

  onCancel(): void { this.router.navigate([this.appRoutes.ITEM]); }
}
