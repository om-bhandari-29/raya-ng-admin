// import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
// import { Base } from './base';
// import { Observable, of, Subject, takeUntil } from 'rxjs';
// import { LoaderService } from '../services/loader-service';
// // import { PaginationControlMetadata } from '../interface/model/pagination-detail.model';
// // import { initializePagInationPayload, IPaginationPayload } from '../interface/request/genericPayload';

// @Component({
//   selector: 'app-search-base',
//   standalone: false,
//   template: '',
// })
// export class SearchBase<T> extends Base implements OnInit {
//   public data: WritableSignal<T> = signal(null as T);

//   public loaderService: LoaderService = inject(LoaderService);
//   public searchString$: Subject<string> = new Subject<string>();
//   protected payLoad: IPaginationPayload = initializePagInationPayload() as IPaginationPayload;

//   ngOnInit(): void {
//     this.search();
//   }

//   protected search() {
//     this.loaderService.showLoader();
//     this.getData().pipe(takeUntil(this.searchString$))
//       .subscribe({
//         next: (value) => {
//           this.data.set(value);
//           this.dataLoadedHandler(value);
//           this.loaderService.hideLoader();
//         },
//         error: (err) => {
//           this.loaderService.hideLoader();
//         }
//       });
//   }

//   public topChange(top: number) {
//     this.payLoad.top = top;
//     this.payLoad.pageIndex = 1
//     this.search();
//   }

//   public pageChange(pageIndex: number) {
//     this.payLoad.pageIndex = pageIndex;
//     this.search();
//   }

//   public searchText(searchText: string) {
//     this.payLoad.search = searchText;
//     this.searchString$.next(searchText);
//     this.payLoad.pageIndex = 1;
//     this.search();
//   }

//   protected getData(): Observable<T> {
//     return of();
//   }

//   protected dataLoadedHandler(data: T): void {
//     // Override in child class if needed
//   }
// }
