import { Component, Input, signal } from '@angular/core';
import { ItemDropdowns } from '../../../item.models';
import { IStoneMaster } from '../../../../stone-master/stone-master.response';

export interface ItemStoneDetail {
  id: number;
  stone_family_id: number | null;
  stone_clarity_id: number | null;
  stone_shape_id: number | null;
  weight_carat: number;
}

@Component({
  selector: 'app-stone-details-tab',
  imports: [],
  templateUrl: './stone-details-tab.html',
})
export class StoneDetailsTab {
  @Input() dropdowns: ItemDropdowns | null = null;

  stoneDetails = signal<ItemStoneDetail[]>([]);
  stoneModalOpen = signal<boolean>(false);
  stoneModalIsNew = signal<boolean>(false);
  stoneModalDraft = signal<ItemStoneDetail>({ id: 0, stone_family_id: null, stone_clarity_id: null, stone_shape_id: null, weight_carat: 0 });

  get stoneFamilies(): IStoneMaster[] { return this.dropdowns?.stoneFamilies ?? []; }
  get stoneClarities(): IStoneMaster[] { return this.dropdowns?.stoneClarities ?? []; }
  get stoneShapes(): IStoneMaster[] { return this.dropdowns?.stoneShapes ?? []; }

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

  updateDraft(field: keyof ItemStoneDetail, value: any): void {
    this.stoneModalDraft.update(d => ({ ...d, [field]: value }));
  }

  deleteRow(id: number): void {
    this.stoneDetails.update(s => s.filter(r => r.id !== id));
  }

  getStoneName(list: IStoneMaster[], id: number | null): string {
    if (!id) return '—';
    return list.find(s => s.id === id)?.name ?? '—';
  }
}
