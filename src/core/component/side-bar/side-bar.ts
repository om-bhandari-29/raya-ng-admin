import { Component, signal, WritableSignal } from '@angular/core';
import { IMenuSideBarItem, MenuItems } from './sidebar.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavBar } from "../nav-bar/nav-bar";

@Component({
  selector: 'app-side-bar',
  imports: [CommonModule, FormsModule, RouterModule, NavBar],
  templateUrl: './side-bar.html',
  styleUrl: './side-bar.scss',
})
export class SideBar {
  public menuItems: WritableSignal<IMenuSideBarItem[]> = signal(MenuItems);
}
