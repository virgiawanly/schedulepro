import { CommonModule, DOCUMENT } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, HostListener, Inject, Renderer2, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { LUCIDE_ICONS, LucideAngularModule, LucideIconProvider, icons } from 'lucide-angular';
import { CookieService } from 'ngx-cookie-service';
import { SimplebarAngularModule } from 'simplebar-angular';
import { DrawerModule } from '../../../../shared/components/drawer';
import { MnDropdownComponent } from '../../../../shared/components/dropdown';
import { LanguageService } from '../../../../core/services/language.service';
import { changeMode, changesidebarcolor, changesidebarsize, changetopbarcolor } from '../../../../store/layout/layout.actions';
import { getLayout, getLayoutmode, getSidebarcolor, getSidebarsize, getTopbarcolor } from '../../../../store/layout/layout.selectors';
import { AuthService } from '../../../../core/services/auth.service';
import { MDModalModule } from '../../../../shared/components/modals';
import { getUser } from '../../../../store/user/user.selectors';
import { User } from '../../../../../types/users';

const avatar3 = 'assets/images/users/avatar-3.png';
const avatar5 = 'assets/images/users/avatar-5.png';

const notification = [
  {
    id: 1,
    type: 'follower',
    imageClassName: 'size-10 rounded-md shrink-0 bg-slate-100',
    image: avatar3,
    boldName: '@willie_passem',
    name: 'followed you',
    time: '4 sec',
    date: 'Wednesday 03:42 PM',
  },
  {
    id: 2,
    type: 'mention',
    imageClassName: 'size-10 bg-yellow-100 rounded-md shrink-0',
    image: avatar5,
    boldName: '@caroline_jessica',
    name: 'commented on your post',
    time: '15 min',
    description: 'Amazing! Fast, to the point, professional and really amazing to work with them!!!',
    date: 'Wednesday 03:42 PM',
  },
  {
    id: 3,
    type: 'invite',
    imageClassName: 'flex items-center justify-center size-10 bg-red-100 rounded-md shrink-0',
    name: 'Successfully purchased a business plan for',
    price: '$199.99',
    time: 'Yesterday',
    date: 'Monday 11:26 AM',
  },
  {
    id: 4,
    type: 'mention',
    boldName: '@scott',
    name: 'liked your post',
    time: '1 Week',
    date: 'Thursday 06:59 AM',
  },
];

const cart = [
  {
    id: 1,
    image: 'assets/images/product/img-01.png',
    name: 'Cotton collar t-shirts for men',
    price: 155.32,
    category: 'Fashion',
    quantity: 2,
    total: 310.64,
  },
  {
    id: 2,
    image: 'assets/images/product/img-03.png',
    name: 'Like style travel black handbag',
    price: 349.95,
    category: 'Luggage',
    quantity: 1,
    total: 349.95,
  },
  {
    id: 3,
    image: 'assets/images/product/img-09.png',
    name: 'Blive Printed Men Round Neck',
    price: 546.74,
    category: 'Fashion',
    quantity: 4,
    total: 2186.96,
  },
];

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [DrawerModule, MnDropdownComponent, LucideAngularModule, SimplebarAngularModule, RouterModule, CommonModule, MDModalModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [{ provide: LUCIDE_ICONS, multi: true, useValue: new LucideIconProvider(icons) }, LanguageService],
})
export class TopbarComponent {
  private store = inject(Store);

  user: User | null = null;
  cookieValue: any;
  flagvalue: any;
  notifyList: any;
  type: any = 'all';
  mode: any;
  subtotal: any = 0;
  discount: any;
  discountRate = 0.12;
  shipping: any;
  shippingRate: any = this.subtotal != 0 ? '65.00' : '0';
  tax: any;
  taxRate = 0.18;
  totalprice: any;
  size: any;
  cartlist: any;
  quantity: number = 0;
  layout: any;

  languageList = [
    { text: 'English', flag: 'assets/images/flags/20/us.svg', lang: 'en' },
    { text: 'Spanish', flag: 'assets/images/flags/20/es.svg', lang: 'sp' },
    { text: 'German', flag: 'assets/images/flags/20/de.svg', lang: 'gr' },
    { text: 'French', flag: 'assets/images/flags/20/fr.svg', lang: 'fr' },
    { text: 'Japanese', flag: 'assets/images/flags/20/jp.svg', lang: 'jp' },
    { text: 'Chinese', flag: 'assets/images/flags/20/china.svg', lang: 'ch' },
    { text: 'Italian', flag: 'assets/images/flags/20/it.svg', lang: 'it' },
    { text: 'Russian', flag: 'assets/images/flags/20/ru.svg', lang: 'ru' },
    { text: 'Arabic', flag: 'assets/images/flags/20/ae.svg', lang: 'ar' },
  ];

  constructor(
    @Inject(DOCUMENT) private document: Document,
    public translate: TranslateService,
    public languageService: LanguageService,
    public _cookiesService: CookieService,
    private _authService: AuthService,
    private _router: Router,
  ) {
    translate.setDefaultLang('en');
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    const windowSize = document.documentElement.clientWidth;

    // Get Layout
    this.store.select(getLayout).subscribe((data) => {
      this.layout = data;
    });

    if (this.layout == 'vertical') {
      if (windowSize > 768 && windowSize < 1024) {
        this.store.dispatch(changesidebarsize({ size: 'sm' }));
      } else {
        this.store.dispatch(changesidebarsize({ size: 'lg' }));
      }
    } else {
      this.store.dispatch(changesidebarsize({ size: 'lg' }));
    }
  }

  ngOnInit(): void {
    this.cartlist = cart;
    this.notifyList = notification;
    this.cartlist.map((x: any) => {
      x['total'] = (x['quantity'] * x['price']).toFixed(2);
      this.subtotal += parseFloat(x['total']);
    });
    this.subtotal = this.subtotal.toFixed(2);
    this.discount = (this.subtotal * this.discountRate).toFixed(2);
    this.tax = (this.subtotal * this.taxRate).toFixed(2);
    this.totalprice = (parseFloat(this.subtotal) + parseFloat(this.tax) + parseFloat(this.shippingRate) - parseFloat(this.discount)).toFixed(2);

    // Cookies wise Language set
    this.cookieValue = this._cookiesService.get('lang');
    const val = this.languageList.filter((x) => x.lang === this.cookieValue);
    if (val.length === 0) {
      if (this.flagvalue === undefined) {
        this.flagvalue = 'assets/images/flags/us.svg';
      }
    } else {
      this.flagvalue = val.map((element) => element.flag);
    }

    this.store.select(getUser).subscribe((user) => {
      this.user = user;
    });
  }

  windowScroll() {
    const scrollUp = document.documentElement.scrollTop;
    if (scrollUp >= 50) {
      document.getElementById('page-topbar')?.classList.add('is-sticky');
    } else {
      document.getElementById('page-topbar')?.classList.remove('is-sticky');
    }
  }

  setLanguage(text: string, lang: string, flag: string) {
    this.flagvalue = flag;
    this.cookieValue = lang;
    this.languageService.setLanguage(lang);
  }

  changeLayoutMode() {
    this.store.select(getLayoutmode).subscribe((mode) => {
      this.mode = mode;
    });

    if (this.mode == 'light') {
      this.store.dispatch(changeMode({ mode: 'dark' }));
      this.store.dispatch(changesidebarcolor({ sidebar: 'dark' }));
      this.store.dispatch(changetopbarcolor({ topbar: 'dark' }));
      this.store.select(getLayoutmode).subscribe((mode) => {
        document.documentElement.setAttribute('data-mode', mode);
      });
      this.store.select(getSidebarcolor).subscribe((color) => {
        document.documentElement.setAttribute('data-sidebar', color);
      });
      this.store.select(getTopbarcolor).subscribe((topbar) => {
        document.documentElement.setAttribute('data-topbar', topbar);
      });
    } else {
      this.store.dispatch(changeMode({ mode: 'light' }));
      this.store.dispatch(changesidebarcolor({ sidebar: 'light' }));
      this.store.dispatch(changetopbarcolor({ topbar: 'light' }));
      this.store.select(getLayoutmode).subscribe((mode) => {
        document.documentElement.setAttribute('data-mode', mode);
      });
      this.store.select(getSidebarcolor).subscribe((color) => {
        document.documentElement.setAttribute('data-sidebar', color);
      });
      this.store.select(getTopbarcolor).subscribe((topbar) => {
        document.documentElement.setAttribute('data-topbar', topbar);
      });
    }
  }

  changeSidebar() {
    const windowSize = document.documentElement.clientWidth;
    let sidebarOverlay = document.getElementById('sidebar-overlay') as any;

    if (windowSize < 768) {
      this.document.body.classList.add('overflow-hidden');
      // Check if the sidebar overlay is hidden
      if (sidebarOverlay.classList.contains('hidden')) {
        sidebarOverlay.classList.remove('hidden');
        this.document.documentElement.querySelector('.app-menu')?.classList.remove('hidden');
      } else {
        sidebarOverlay.classList.add('hidden');
        this.document.documentElement.querySelector('.app-menu')?.classList.add('hidden');
      }
      this.store.dispatch(changesidebarsize({ size: 'lg' }));
    } else {
      this.store.select(getSidebarsize).subscribe((size) => {
        this.size = size;
      });
      this.store.dispatch(changesidebarsize({ size: this.size === 'sm' ? 'lg' : 'sm' }));
    }
  }

  NotifyFilter(type: any) {
    this.type = type;
    if (type == 'all') {
      this.notifyList = notification;
    } else {
      this.notifyList = notification.filter((item: any) => item.type == type);
    }
  }

  calculateQty(id: any, quantity: any, i: any) {
    this.subtotal = 0;
    if (id == '0' && quantity > 1) {
      quantity--;
      this.cartlist[i].quantity = quantity;
      this.cartlist[i].total = (this.cartlist[i].quantity * this.cartlist[i].price).toFixed(2);
    }
    if (id == '1') {
      quantity++;
      this.cartlist[i].quantity = quantity;
      this.cartlist[i].total = (this.cartlist[i].quantity * this.cartlist[i].price).toFixed(2);
    }
    this.cartlist.map((x: any) => {
      this.subtotal += parseFloat(x['total']);
    });
    this.subtotal = this.subtotal.toFixed(2);
    this.discount = (this.subtotal * this.discountRate).toFixed(2);
    this.tax = (this.subtotal * this.taxRate).toFixed(2);
    this.totalprice = (parseFloat(this.subtotal) + parseFloat(this.tax) + parseFloat(this.shippingRate) - parseFloat(this.discount)).toFixed(2);
  }

  logout() {
    this._authService.logout().subscribe(() => {
      this._router.navigate(['/auth/login']);
    });
  }
}
