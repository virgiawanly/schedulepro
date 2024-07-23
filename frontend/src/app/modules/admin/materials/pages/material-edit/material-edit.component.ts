import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import { HttpFormattedErrorResponse } from '../../../../../../types/http';
import { Material } from '../../../../../../types/materials';
import { HttpService } from '../../../../../core/services/http.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { PageTitleComponent } from '../../../../../shared/components/page-title/page-title.component';
import { MaterialForm } from '../../components/material-form/material-form';
import { MaterialFormComponent } from '../../components/material-form/material-form.component';

@Component({
  selector: 'app-material-edit',
  standalone: true,
  imports: [PageTitleComponent, MaterialFormComponent],
  templateUrl: './material-edit.component.html',
  styleUrl: './material-edit.component.scss',
})
export class MaterialEditComponent {
  isSubmitting: boolean = false;
  isLoadingMaterial: boolean = false;
  materialUuid: string | null = null;
  materialForm: MaterialForm = new MaterialForm();
  material: Material | null = null;

  constructor(
    private _httpService: HttpService,
    private _toastService: ToastService,
    private _location: Location,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
  ) {
    this.materialUuid = this._activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    if (this.materialUuid) {
      this.getMaterial();
    }
  }

  getMaterial() {
    this.isLoadingMaterial = true;
    this.materialForm.disable();
    this._httpService
      .get(`v1/materials/${this.materialUuid}`, { headers: { 'Location-Id': 1 } })
      .subscribe({
        next: (res: any) => {
          const formValue = {
            ...res.data,
            image: null,
            image_preview: res.data.image_url,
          };

          this.material = res.data;
          this.materialForm.patchValue(formValue);
        },
        error: (error: HttpFormattedErrorResponse) => {
          if (error.status !== 401) {
            this._toastService.error(error.message);
          }
        },
      })
      .add(() => {
        this.materialForm.enable();
        this.isLoadingMaterial = false;
      });
  }

  submit() {
    this.materialForm.markAllAsTouched();

    if (this.materialForm.invalid || !this.materialUuid || this.materialForm.disabled || this.isSubmitting || this.isLoadingMaterial) {
      return;
    }

    const payload = this._httpService.convertToFormData(this.materialForm.value);

    this.isSubmitting = true;
    this.materialForm.disable();
    this._httpService
      .post(`v1/materials/${this.materialUuid}`, payload, {
        headers: { 'Location-Id': 1 },
        params: {
          _method: 'PUT',
        },
      })
      .subscribe({
        next: (res: any) => {
          this._toastService.success(res.message);
          this._router.navigateByUrl('/admin/materials');
        },
        error: (error: HttpFormattedErrorResponse) => {
          if (error.status !== 401) {
            this._toastService.error(error.message);
          }
        },
      })
      .add(() => {
        this.materialForm.enable();
        this.isSubmitting = false;
      });
  }

  back() {
    this._location.back();
  }
}
