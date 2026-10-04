import { inject } from '@angular/core';
import { CanActivateChildFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { TranslationService, Language } from './translation.service';

export const langGuard: CanActivateChildFn = (childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const i18n = inject(TranslationService);
  const lang: Language = state.url.startsWith('/en') || state.url === '/en' ? 'en' : 'ar';
  i18n.setLanguageFromRoute(lang);
  return true;
};
