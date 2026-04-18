import { Component } from '@angular/core';
import { NavBar } from "../nav-bar/nav-bar";
import { SideBar } from "../side-bar/side-bar";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-layout',
  imports: [NavBar, SideBar, RouterOutlet],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {

}
