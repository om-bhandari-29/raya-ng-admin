import { Component, signal } from '@angular/core';
import { SideBar } from "../core/component/side-bar/side-bar";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('raya-ng-admin');
}
