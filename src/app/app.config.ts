import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import {
  provideRouter,
  withInMemoryScrolling,
  withViewTransitions,
} from '@angular/router';

import { routes } from './app.routes';
import {
  provideClientHydration,
  withIncrementalHydration,
} from '@angular/platform-browser';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { headerInterceptor } from './interceptors/header.interceptor';
import { errorInterceptor } from './interceptors/error.interceptor';
import { provideIcons } from '@ng-icons/core';
import {
  lucideArrowRight,
  lucideBoxes,
  lucideCheck,
  lucideCheckCheck,
  lucideCircleArrowDown,
  lucideCircleArrowLeft,
  lucideCircleCheckBig,
  lucideCircleUserRound,
  lucideCircleX,
  lucideClock,
  lucideCreditCard,
  lucideFileUser,
  lucideHeart,
  lucideLoaderCircle,
  lucideLogOut,
  lucideMap,
  lucideMenu,
  lucidePlus,
  lucideSearch,
  lucideShieldEllipsis,
  lucideShoppingCart,
  lucideStar,
  lucideTrash,
  lucideTrash2,
  lucideTruck,
  lucideUser,
  lucideUserLock,
  lucideUserPlus,
  lucideX,
} from '@ng-icons/lucide';
import {
  phosphorDotsThreeOutline,
  phosphorHeartStraight,
  phosphorHouse,
  phosphorShoppingCart,
} from '@ng-icons/phosphor-icons/regular';
import {
  phosphorDotsThreeOutlineFill,
  phosphorHeartStraightFill,
  phosphorHouseFill,
  phosphorShoppingCartFill,
  phosphorStarFill,
} from '@ng-icons/phosphor-icons/fill';
// import { loadingInterceptor } from './interceptors/loading.interceptor';
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
      }),
      withViewTransitions(),
    ),
    provideClientHydration(withIncrementalHydration()),
    provideHttpClient(
      withFetch(),
      withInterceptors([
        headerInterceptor,
        errorInterceptor,
        // loadingInterceptor,
      ]),
    ),
    provideIcons({
      lucideUser,
      lucideMenu,
      lucideShoppingCart,
      lucideCircleArrowDown,
      lucideHeart,
      lucideBoxes,
      lucideCircleUserRound,
      lucideLogOut,
      lucideLoaderCircle,
      lucideX,
      lucideTrash,
      lucideSearch,
      lucideArrowRight,
      phosphorHeartStraight,
      phosphorHeartStraightFill,
      lucideTrash2,
      phosphorStarFill,
      lucideMap,
      lucideShieldEllipsis,
      lucideCircleCheckBig,
      lucideFileUser,
      lucideCircleX,
      lucideCircleArrowLeft,
      lucideUserLock,
      lucidePlus,
      lucideCheckCheck,
      lucideStar,
      lucideUserPlus,
      phosphorHouse,
      phosphorHouseFill,
      phosphorShoppingCart,
      phosphorShoppingCartFill,
      phosphorDotsThreeOutline,
      phosphorDotsThreeOutlineFill,
      lucideCreditCard,
      lucideClock,
      lucideCheck,
      lucideTruck,
    }),
  ],
};
