import {
  Component,
  input,
  output,
  signal,
  inject,
  ElementRef,
  OnInit,
  OnDestroy,
  effect,
  forwardRef,
} from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

export interface ISearchableDropdownItem {
  id: number;
  name: string;
}

@Component({
  selector: 'app-searchable-dropdown',
  imports: [FormsModule],
  templateUrl: './searchable-dropdown.html',
  styleUrl: './searchable-dropdown.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchableDropdown),
      multi: true,
    },
  ],
})
export class SearchableDropdown implements OnInit, OnDestroy, ControlValueAccessor {
  private elRef = inject(ElementRef);

  // Inputs
  items = input<ISearchableDropdownItem[]>([]);
  placeholder = input<string>('Select an option');
  label = input<string>('');
  loading = input<boolean>(false);

  // Outputs
  searchChange = output<string>();
  selectionChange = output<ISearchableDropdownItem | null>();

  // State
  isOpen = signal<boolean>(false);
  searchText = signal<string>('');
  selected = signal<ISearchableDropdownItem | null>(null);
  isDisabled = signal<boolean>(false);

  private searchTimeout: any;
  private clickListener!: (e: Event) => void;
  private onChange: (value: ISearchableDropdownItem | null) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    effect(() => {
      const currentItems = this.items();
      const sel = this.selected();
      if (sel && currentItems.length && !this.searchText()) {
        this.searchText.set(sel.name);
      }
    });
  }

  // ── ControlValueAccessor ─────────────────────────────────────────────────

  writeValue(value: ISearchableDropdownItem | null): void {
    this.selected.set(value);
    this.searchText.set(value?.name ?? '');
  }

  registerOnChange(fn: (value: ISearchableDropdownItem | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  // ── Lifecycle ────────────────────────────────────────────────────────────

  ngOnInit(): void {
    this.clickListener = (e: Event) => {
      if (!this.elRef.nativeElement.contains(e.target)) {
        this.isOpen.set(false);
      }
    };
    document.addEventListener('click', this.clickListener);
  }

  ngOnDestroy(): void {
    document.removeEventListener('click', this.clickListener);
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
  }

  // ── Actions ──────────────────────────────────────────────────────────────

  onFocus(): void {
    this.isOpen.set(true);
    this.onTouched();
  }

  onSearchChange(value: string): void {
    this.searchText.set(value);
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.searchChange.emit(value);
    }, 300);
  }

  selectItem(item: ISearchableDropdownItem): void {
    this.selected.set(item);
    this.searchText.set(item.name);
    this.isOpen.set(false);
    this.onChange(item);
    this.selectionChange.emit(item);
    this.onTouched();
  }

  clear(): void {
    this.selected.set(null);
    this.searchText.set('');
    this.onChange(null);
    this.selectionChange.emit(null);
    this.searchChange.emit('');
  }
}
