import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, signal } from '@angular/core';
import { ItemDropdowns } from '../../../item.models';
import { IItem } from '../../../item.response';
import { IStoneMaster } from '../../../../stone-master/stone-master.response';

export interface ItemStoneDetailRow {
  id: number;
  stone_family_id: number | null;
  stone_clarity_id: number | null;
  stone_shape_id: number | null;
  weight_carat: number;
}

export type ItemStoneDetailsPayload = {
  stone_details: { stone_family_id: number; stone_shape_id: number; weight_carat: number; stone_clarity_id?: number }[];
};

@Component({
  selector: 'app-stone-details-tab',
  imports: [],
  templateUrl: './stone-details-tab.html',
})
export class StoneDetailsTab implements OnChanges {
  @Input() item: IItem | null = null;
  @Input() dropdowns: ItemDropdowns | null = null;
  @Input() isSaving = false;
  @Output() save = new EventEmitter<ItemStoneDetailsPayload>();

  stoneDetails = signal<ItemStoneDetailRow[]>([]);
  stoneModalOpen = signal<boolean>(false);
  stoneModalIsNew = signal<boolean>(false);
  stoneModalDraft = signal<ItemStoneDetailRow>({ id: 0, stone_family_id: null, stone_clarity_id: null, stone_shape_id: null, weight_carat: 0 });

  get stoneFamilies(): IStoneMaster[] { return this.dropdowns?.stoneFamilies ?? []; }
  get stoneClarities(): IStoneMaster[] { return this.dropdowns?.stoneClarities ?? []; }
  get stoneShapes(): IStoneMaster[] { return this.dropdowns?.stoneShapes ?? []; }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['item'] && this.item) {
      this.stoneDetails.set((this.item.stone_details ?? []).map(s => ({
        id: s.id,
        stone_family_id: s.stone_family_id,
        stone_clarity_id: s.stone_clarity_id,
        stone_shape_id: s.stone_shape_id,
        weight_carat: s.weight_carat,
      })));
    }
  }

  addStone(): void {
    this.stoneModalDraft.set({ id: Date.now(), stone_family_id: null, stone_clarity_id: null, stone_shape_id: null, weight_carat: 0 });
    this.stoneModalIsNew.set(true);
    this.stoneModalOpen.set(true);
  }

  openModal(id: number): void {
    const row = this.stoneDetails().find(r => r.id === id);
    if (!row) return;
    this.stoneModalDraft.set({ ...row });
    this.stoneModalIsNew.set(false);
    this.stoneModalOpen.set(true);
  }

  closeModal(): void { this.stoneModalOpen.set(false); }

  confirmModal(): void {
    const draft = this.stoneModalDraft();
    if (this.stoneModalIsNew()) {
      this.stoneDetails.update(s => [...s, { ...draft }]);
    } else {
      this.stoneDetails.update(rows => rows.map(r => r.id === draft.id ? { ...draft } : r));
    }
    this.stoneModalOpen.set(false);
  }

  updateDraft(field: keyof ItemStoneDetailRow, value: any): void {
    this.stoneModalDraft.update(d => ({ ...d, [field]: value }));
  }

  deleteRow(id: number): void { this.stoneDetails.update(s => s.filter(r => r.id !== id)); }

  getStoneName(list: IStoneMaster[], id: number | null): string {
    if (!id) return '—';
    return list.find(s => s.id === id)?.name ?? '—';
  }

  onSave(): void {
    this.save.emit({
      stone_details: this.stoneDetails()
        .filter(r => r.stone_family_id && r.stone_shape_id)
        .map(r => ({
          stone_family_id: r.stone_family_id!,
          stone_shape_id: r.stone_shape_id!,
          weight_carat: r.weight_carat,
          ...(r.stone_clarity_id ? { stone_clarity_id: r.stone_clarity_id } : {}),
        })),
    });
  }
}
