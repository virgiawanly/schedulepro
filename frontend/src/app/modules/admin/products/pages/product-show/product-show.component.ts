import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { HttpFormattedErrorResponse } from '../../../../../../types/http';
import { Product } from '../../../../../../types/products';
import { HttpService } from '../../../../../core/services/http.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { MnDropdownComponent } from '../../../../../shared/components/dropdown';
import { MDModalModule } from '../../../../../shared/components/modals';
import { PageTitleComponent } from '../../../../../shared/components/page-title/page-title.component';

@Component({
  selector: 'app-product-show',
  standalone: true,
  imports: [CommonModule, RouterModule, PageTitleComponent, LucideAngularModule, MnDropdownComponent, MDModalModule],
  templateUrl: './product-show.component.html',
  styleUrl: './product-show.component.scss',
})
export class ProductShowComponent {
  isLoadingProduct: boolean = false;
  isDeletingProduct: boolean = false;
  isUpdatingProductStatus: boolean = false;
  productUuid: string | null = null;
  product: Product | null = null;

  constructor(
    private _httpService: HttpService,
    private _toastService: ToastService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
  ) {
    this.productUuid = this._activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    if (this.productUuid) {
      this.getProduct();
    }
  }

  getProduct() {
    this.isLoadingProduct = true;
    this._httpService
      .get(`v1/products/${this.productUuid}`, { headers: { 'Location-Id': 1 } })
      .subscribe({
        next: (res: any) => {
          this.product = res.data;
        },
        error: (error: HttpFormattedErrorResponse) => {
          if (error.status !== 401) {
            this._toastService.error(error.message);
          }

          this._router.navigateByUrl('/admin/products', { replaceUrl: true });
        },
      })
      .add(() => {
        this.isLoadingProduct = false;
      });
  }

  deleteProduct() {
    if (this.isDeletingProduct || !this.product) {
      return;
    }

    this.isDeletingProduct = true;
    this._httpService
      .delete(`v1/products/${this.product?.uuid}`, { headers: { 'Location-Id': 1 } })
      .subscribe({
        next: (res: any) => {
          this._toastService.success(res.message);
          this._router.navigateByUrl('/admin/products', { replaceUrl: true });
        },
        error: (error: HttpFormattedErrorResponse) => {
          if (error.status !== 401) {
            this._toastService.error(error.message);
          }
        },
      })
      .add(() => {
        this.isDeletingProduct = false;
      });
  }

  toggleStatus() {
    if (this.isUpdatingProductStatus || !this.product) {
      return;
    }

    this.isUpdatingProductStatus = true;
    this._httpService
      .put(`v1/products/${this.product?.uuid}/toggle-status`, null, { headers: { 'Location-Id': 1 } })
      .subscribe({
        next: (res: any) => {
          if (this.product) {
            this.product.is_active = !this.product.is_active;
          }

          this._toastService.success(res.message);
        },
        error: (error: HttpFormattedErrorResponse) => {
          if (error.status !== 401) {
            this._toastService.error(error.message);
          }
        },
      })
      .add(() => {
        this.isUpdatingProductStatus = false;
      });
  }
}
