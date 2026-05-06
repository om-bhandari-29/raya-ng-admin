import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BreadcrumbService } from '../../core/services/breadcrumb.service';
import { APPRoutes } from '../../core/constant/app-routes';

@Component({
  selector: 'app-stock',
  imports: [RouterLink],
  templateUrl: './stock.html',
  styleUrl: './stock.scss',
})
export class Stock implements OnInit {
  private breadcrumb = inject(BreadcrumbService);
  readonly routes = APPRoutes;

  ngOnInit(): void {
    this.breadcrumb.set([{ label: 'Stock' }]);
  }
}
