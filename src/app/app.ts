import { Component, signal } from '@angular/core';
import { SideBar } from "../core/component/side-bar/side-bar";

@Component({
  selector: 'app-root',
  imports: [SideBar],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('raya-ng-admin');
}
