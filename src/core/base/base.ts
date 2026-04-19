import { Component, inject } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
// import { ApiRoutes, ToastService, variable, ConfirmationUtil } from '@shared';
import { APPRoutes } from '../constant/app-routes';
import { APIRoutes } from '../constant/api-routes';
import { environment } from '../../environment/dev.env';
import { variable } from '../enum/variable.enum';

@Component({
  selector: 'app-base',
  standalone: false,
  template: '',
})
export class Base {
  public toastr: ToastrService = inject(ToastrService);
  // public toastService: ToastService = inject(ToastService);

  public subscriptionArray: Array<Subscription> = [];
  public readonly apiBaseUrl: string = environment.baseUrl;
  // public readonly objConfirmationUtil: ConfirmationUtil = new ConfirmationUtil();
  public readonly apiRoutes = APIRoutes;
  public readonly appRoutes = APPRoutes;

  private httpClient: HttpClient = inject(HttpClient);

  public httpGetPromise<RType>(url: string, showLoader: boolean = true): Promise<RType> {
    const getPromise: Promise<RType> = new Promise((resolve, reject) => {
      const sub: Subscription = this.httpClient
        .get<RType>(this.apiBaseUrl + url, {
          headers: this.getHeaderWithLoaderConfigure(showLoader),
        })
        .subscribe({
          next: (res: RType) => {
            resolve(res);
          },

          error: (err: HttpErrorResponse) => {
            reject(err);
          },
        });
    });

    return getPromise;
  }

  public httpPostPromise<RType, PType>(
    url: string,
    payload: PType,
    showLoader: boolean = true
  ): Promise<RType> {
    return new Promise((resolve, reject) => {
      this.httpClient
        .post<RType>(this.apiBaseUrl + url, payload, {
          headers: this.getHeaderWithLoaderConfigure(showLoader),
        })
        .subscribe({
          next: (res: RType) => resolve(res),
          error: (err: HttpErrorResponse) => reject(err),
        });
    });
  }

  public httpPostObservable<RType, PType>(
    url: string,
    payload: PType,
    showLoader: boolean = true
  ): Observable<RType> {
    return this.httpClient.post<RType>(this.apiBaseUrl + url, payload, {
      headers: this.getHeaderWithLoaderConfigure(showLoader),
    });
  }

  public httpPutPromise<RType, PType>(
    url: string,
    payload: PType,
    showLoader: boolean = true
  ): Promise<RType> {
    return new Promise((resolve, reject) => {
      this.httpClient
        .put<RType>(this.apiBaseUrl + url, payload, {
          headers: this.getHeaderWithLoaderConfigure(showLoader),
        })
        .subscribe({
          next: (res: RType) => resolve(res),
          error: (err: HttpErrorResponse) => reject(err),
        });
    });
  }

  public httpPatchPromise<RType, PType>(
    url: string,
    payload: PType,
    showLoader: boolean = true
  ): Promise<RType> {
    return new Promise((resolve, reject) => {
      this.httpClient
        .patch<RType>(this.apiBaseUrl + url, payload, {
          headers: this.getHeaderWithLoaderConfigure(showLoader),
        })
        .subscribe({
          next: (res: RType) => resolve(res),
          error: (err: HttpErrorResponse) => reject(err),
        });
    });
  }

  public httpDeletePromise<T>(url: string, showLoader: boolean = true): Promise<T> {
    return new Promise((resolve, reject) => {
      this.httpClient
        .delete<T>(this.apiBaseUrl + url, {
          headers: this.getHeaderWithLoaderConfigure(showLoader),
        })
        .subscribe({
          next: (res: T) => resolve(res),
          error: (err: HttpErrorResponse) => reject(err),
        });
    });
  }

  public getDecodedToken(): any {
    // const token: string = getLocalStorageItem<string>(localStorageEnum.token) ?? '';
    // let decoded: IUserSession = {} as IUserSession;
    // if (token != '') {
    //   decoded = jwtDecode(token) as IUserSession;
    // }

    // return decoded;
    return AnalyserNode;
  }

  private getHeaderWithLoaderConfigure(showLoader: boolean): HttpHeaders {
    const header = new HttpHeaders({
      [variable.headerLoader]: showLoader.toString(),
    });

    return header;
  }

  ngOnDestroy(): void {
    this.unsubscribeAll();
  }

  private unsubscribeAll() {
    if (this.subscriptionArray.length) {
      this.subscriptionArray.forEach((subs) => {
        subs.unsubscribe();
      });
    }
  }
}
