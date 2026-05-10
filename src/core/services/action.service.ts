import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ActionService {
  private _title = new BehaviorSubject<string>('');
  private _buttonTitle = new BehaviorSubject<string>('');
  private _buttonClick = new Subject<void>();

  title$ = this._title.asObservable();
  buttonTitle$ = this._buttonTitle.asObservable();
  buttonClick$ = this._buttonClick.asObservable();

  setTitle(title: string): void {
    this._title.next(title);
  }

  setButtonTitle(buttonTitle: string): void {
    this._buttonTitle.next(buttonTitle);
  }

  setHeaderConfig(title: string, buttonTitle: string): void {
    this._title.next(title);
    this._buttonTitle.next(buttonTitle);
  }

  emitButtonClick(): void {
    this._buttonClick.next();
  }
}
