import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpFormattedErrorResponse } from '../../../../../../types/http';
import { HttpService } from '../../../../../core/services/http.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { PageTitleComponent } from '../../../../../shared/components/page-title/page-title.component';
import { ProductForm } from '../../components/product-form/product-form';
import { ProductFormComponent } from '../../components/product-form/product-form.component';

@Component({
  selector: 'app-product-edit',
  standalone: true,
  imports: [PageTitleComponent, ProductFormComponent],
  templateUrl: './product-edit.component.html',
  styleUrl: './product-edit.component.scss',
})
export class ProductEditComponent {
  isSubmitting: boolean = false;
  isLoadingProduct: boolean = false;
  productUuid: string | null = null;
  productForm: ProductForm = new ProductForm();

  constructor(
    private _httpService: HttpService,
    private _toastService: ToastService,
    private _location: Location,
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
    this.productForm.disable();
    this._httpService
      .get(`v1/products/${this.productUuid}`, { headers: { 'Location-Id': 1 } })
      .subscribe({
        next: (res: any) => {
          this.productForm.patchValue(res.data);
        },
        error: (error: HttpFormattedErrorResponse) => {
          if (error.status !== 401) {
            this._toastService.error(error.message);
          }
        },
      })
      .add(() => {
        this.productForm.enable();
        this.isLoadingProduct = false;
      });
  }

  submit() {
    this.productForm.markAllAsTouched();

    if (this.productForm.invalid || !this.productUuid || this.productForm.disabled || this.isSubmitting || this.isLoadingProduct) {
      return;
    }

    this.isSubmitting = true;
    this.productForm.disable();
    this._httpService
      .put(`v1/products/${this.productUuid}`, this.productForm.value, {
        headers: { 'Location-Id': 1 },
      })
      .subscribe({
        next: (res: any) => {
          this._toastService.success(res.message);
          this._router.navigateByUrl('/admin/products/' + this.productUuid);
        },
        error: (error: HttpFormattedErrorResponse) => {
          if (error.status !== 401) {
            this._toastService.error(error.message);
          }
        },
      })
      .add(() => {
        this.productForm.enable();
        this.isSubmitting = false;
      });
  }

  back() {
    this._location.back();
  }
}
