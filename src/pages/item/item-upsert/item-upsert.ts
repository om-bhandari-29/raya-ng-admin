import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Base } from '../../../core/base/base';
import {
  IGenericListResponse,
  IGenericResponse,
} from '../../../core/response/genericResponse.interface';
import {
  IComboItem,
  IComboHsnCode,
  IComboItemFrappeBased,
} from '../../../core/response/combo.interface';
import { IItemAttribute } from '../../item-attribute/item-attribute.response';
import { IItem } from '../item.response';
import { ItemDropdowns } from '../item.models';
import { ItemTab, ITEM_TABS } from '../../../core/enum/item-tab.enum';
import { DetailsTab, ItemDetailsPayload } from './tabs/details-tab/details-tab';
import { InventoryTab, ItemInventoryPayload } from './tabs/inventory-tab/inventory-tab';
import { VariantsTab } from './tabs/variants-tab/variants-tab';
import {
  StoneDetailsTab,
  ItemStoneDetailsPayload,
} from './tabs/stone-details-tab/stone-details-tab';
import { ItemVariantsPayload } from './tabs/variants-tab/variants-tab.model';

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

  override ngOnInit(): void {
    super.ngOnInit();
    const id = this.route.snapshot.queryParamMap.get('id');
    if (id) {
      this.itemId.set(parseInt(id));

      if (this.itemId() > 0) {
        this.isEditMode.set(true);
        this.loadItem();
      }
    }
    this.loadDropdowns();
  }

  setTab(tab: ItemTab): void {
    this.activeTab.set(tab);
  }

  private goNextTab(): void {
    const idx = this.tabs.findIndex((t) => t.key === this.activeTab());
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
          this.apiRoutes.item.UPDATE(this.itemId()),
          payload,
        );
        this.toastr.success('Details saved.');
        this.goNextTab();
      } else {
        const res = await this.httpPostPromise<IGenericResponse<IItem>, ItemDetailsPayload>(
          this.apiRoutes.item.CREATE,
          payload,
        );
        if (res.status) {
          this.itemId.set(res.data.id);
          this.isEditMode.set(true);
          this.item.set(res.data);
          this.router.navigate(['/stock/item/upsert'], {
            queryParams: { name: res.data.name },
            replaceUrl: true,
          });
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
        this.apiRoutes.item.UPDATE(this.itemId()),
        payload,
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
        this.apiRoutes.item.UPDATE(this.itemId()),
        payload,
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
        this.apiRoutes.item.UPDATE(this.itemId()),
        payload,
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
        this.httpGetPromise<IGenericResponse<IComboItemFrappeBased[]>>(
          this.apiRoutes.item_group.COMBO,
        ),
        this.httpGetPromise<IGenericListResponse<IComboItem>>(
          this.apiRoutes.product_master.COMBO(),
        ),
        this.httpGetPromise<IGenericResponse<IComboItem[]>>(this.apiRoutes.uom.COMBO),
        this.httpGetPromise<IGenericResponse<IComboHsnCode[]>>(this.apiRoutes.gst_hsn_code.COMBO),
        this.httpGetPromise<IGenericResponse<IItemAttribute[]>>(
          this.apiRoutes.item_attribute.GET_ALL,
        ),
        this.httpGetPromise<IGenericResponse<IComboItem[]>>(this.apiRoutes.stone_family.COMBO),
        this.httpGetPromise<IGenericResponse<IComboItem[]>>(this.apiRoutes.stone_clarity.COMBO),
        this.httpGetPromise<IGenericResponse<IComboItem[]>>(this.apiRoutes.stone_shape.COMBO),
      ]);
      this.dropdowns.set({
        itemGroups: groups.status ? groups.data : [],
        productMasters: products.status ? products.data.items : [],
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
        this.apiRoutes.item.GET_BY_ID(this.itemId()),
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

  onCancel(): void {
    this.router.navigate([this.appRoutes.ITEM]);
  }

  /** Returns up to 2 uppercase initials from the item name for the avatar. */
  getInitials(): string {
    const name = this.item()?.name ?? '';
    if (!name) return 'IT';
    const words = name.trim().split(/\s+/);
    if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
  }
}
