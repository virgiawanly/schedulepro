import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpFormattedErrorResponse } from '../../../../../../types/http';
import { HttpService } from '../../../../../core/services/http.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { PageTitleComponent } from '../../../../../shared/components/page-title/page-title.component';
import { ProductForm } from '../../components/product-form/product-form';
import { ProductFormComponent } from '../../components/product-form/product-form.component';

@Component({
  selector: 'app-product-create',
  standalone: true,
  imports: [PageTitleComponent, ProductFormComponent],
  templateUrl: './product-create.component.html',
  styleUrl: './product-create.component.scss',
})
export class ProductCreateComponent {
  isSubmitting: boolean = false;
  productForm: ProductForm = new ProductForm();

  constructor(
    private _httpService: HttpService,
    private _toastService: ToastService,
    private _location: Location,
    private _router: Router,
  ) {}

  submit() {
    this.productForm.markAllAsTouched();

    if (this.productForm.invalid || this.productForm.disabled || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.productForm.disable();
    this._httpService
      .post('v1/products', this.productForm.value, {
        headers: { 'Location-Id': 1 },
      })
      .subscribe({
        next: (res: any) => {
          this._toastService.success(res.message);
          this._router.navigateByUrl('/admin/products');
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
