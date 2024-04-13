import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  public languages: string[] = ['ar', 'ch', 'en', 'fr', 'gr', 'it', 'jp', 'ru', 'sp'];

  constructor(
    public translate: TranslateService,
    private cookieService: CookieService,
  ) {
    let browserLang: any;

    this.translate.addLangs(this.languages);
    if (this.cookieService.check('lang')) {
      browserLang = this.cookieService.get('lang');
    } else {
      browserLang = translate.getBrowserLang();
    }

    translate.use(browserLang?.match(/ar|ch|en|fr|gr|it|jp|ru|sp/) ? browserLang : 'en');
  }

  /***
   * Set language and save in cookie.
   *
   * @param  lang any
   * @return void
   */
  public setLanguage(lang: any) {
    this.translate.use(lang);
    this.cookieService.set('lang', lang);
  }
}
