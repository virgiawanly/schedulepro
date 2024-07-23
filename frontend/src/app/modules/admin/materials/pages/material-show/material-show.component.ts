import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { Lightbox, LightboxModule } from 'ngx-lightbox';
import { HttpFormattedErrorResponse } from '../../../../../../types/http';
import { Material } from '../../../../../../types/materials';
import { HttpService } from '../../../../../core/services/http.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { MnDropdownComponent } from '../../../../../shared/components/dropdown';
import { MDModalModule } from '../../../../../shared/components/modals';
import { PageTitleComponent } from '../../../../../shared/components/page-title/page-title.component';

@Component({
  selector: 'app-material-show',
  standalone: true,
  imports: [CommonModule, RouterModule, PageTitleComponent, LucideAngularModule, MnDropdownComponent, MDModalModule, LightboxModule],
  templateUrl: './material-show.component.html',
  styleUrl: './material-show.component.scss',
})
export class MaterialShowComponent {
  isLoadingMaterial: boolean = false;
  isDeletingMaterial: boolean = false;
  isUpdatingMaterialStatus: boolean = false;
  materialUuid: string | null = null;
  material: Material | null = null;

  constructor(
    private _httpService: HttpService,
    private _toastService: ToastService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _lightbox: Lightbox,
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
    this._httpService
      .get(`v1/materials/${this.materialUuid}`, { headers: { 'Location-Id': 1 } })
      .subscribe({
        next: (res: any) => {
          this.material = res.data;
        },
        error: (error: HttpFormattedErrorResponse) => {
          if (error.status !== 401) {
            this._toastService.error(error.message);
          }

          this._router.navigateByUrl('/admin/materials', { replaceUrl: true });
        },
      })
      .add(() => {
        this.isLoadingMaterial = false;
      });
  }

  deleteMaterial() {
    if (this.isDeletingMaterial || !this.material) {
      return;
    }

    this.isDeletingMaterial = true;
    this._httpService
      .delete(`v1/materials/${this.material?.uuid}`, { headers: { 'Location-Id': 1 } })
      .subscribe({
        next: (res: any) => {
          this._toastService.success(res.message);
          this._router.navigateByUrl('/admin/materials', { replaceUrl: true });
        },
        error: (error: HttpFormattedErrorResponse) => {
          if (error.status !== 401) {
            this._toastService.error(error.message);
          }
        },
      })
      .add(() => {
        this.isDeletingMaterial = false;
      });
  }

  toggleStatus() {
    if (this.isUpdatingMaterialStatus || !this.material) {
      return;
    }

    this.isUpdatingMaterialStatus = true;
    this._httpService
      .put(`v1/materials/${this.material?.uuid}/toggle-status`, null, { headers: { 'Location-Id': 1 } })
      .subscribe({
        next: (res: any) => {
          if (this.material) {
            this.material.is_active = !this.material.is_active;
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
        this.isUpdatingMaterialStatus = false;
      });
  }

  openMaterialImage(): void {
    if (!this.material || !this.material.image_url) {
      return;
    }

    this._lightbox.open(
      [
        {
          src: this.material.image_url,
          caption: this.material.name,
          thumb: this.material.image_url,
        },
      ],
      0,
      {
        showZoom: true,
        centerVertically: true,
      },
    );
  }

  closeMaterialImage(): void {
    this._lightbox.close();
  }
}
