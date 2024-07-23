import { Injectable } from '@angular/core';
import { IndividualConfig, ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private _defaultConfig: Partial<IndividualConfig> = {
    positionClass: 'toast-top-right',
    progressBar: true,
    progressAnimation: 'decreasing',
    timeOut: 3000,
    closeButton: true,
  };

  constructor(private _toastrService: ToastrService) {}

  /**
   * Create a success toast
   *
   * @param message
   * @param title
   * @param config
   * @return Promise<HTMLIonToastElement>
   */
  success(message: string, title?: string, config?: Partial<Partial<IndividualConfig<any>>>) {
    return this._toastrService.success(message, title ?? '', {
      ...this._defaultConfig,
      ...config,
    });
  }

  /**
   * Create an error toast
   *
   * @param message
   * @param title
   * @param config
   * @return Promise<HTMLIonToastElement>
   */
  error(message: string, title?: string, config?: Partial<Partial<IndividualConfig<any>>>) {
    return this._toastrService.error(message, title ?? '', {
      ...this._defaultConfig,
      ...config,
    });
  }

  /**
   * Create an info toast
   *
   * @param message
   * @param title
   * @param config
   * @return Promise<HTMLIonToastElement>
   */
  info(message: string, title?: string, config?: Partial<Partial<IndividualConfig<any>>>) {
    return this._toastrService.info(message, title ?? '', {
      ...this._defaultConfig,
      ...config,
    });
  }

  /**
   * Create a warning toast
   *
   * @param message
   * @param title
   * @param config
   * @return Promise<HTMLIonToastElement>
   */
  warning(message: string, title?: string, config?: Partial<Partial<IndividualConfig<any>>>) {
    return this._toastrService.warning(message, title ?? '', {
      ...this._defaultConfig,
      ...config,
    });
  }

  /**
   * Create a toast
   *
   * @param message
   * @param title
   * @param config
   * @return Promise<HTMLIonToastElement>
   */
  create(message: string, title?: string, config?: Partial<Partial<IndividualConfig<any>>>) {
    return this._toastrService.show(message, title ?? '', {
      ...this._defaultConfig,
      ...config,
    });
  }
}
