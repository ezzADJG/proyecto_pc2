import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http'; // <-- Asegúrate de importar withInterceptors
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';
import { jwtInterceptor } from './core/interceptors/jwt.interceptor'; // <-- 1. Importa tu nuevo interceptor

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    
    // 2. Modifica esta línea para que use el interceptor
    provideHttpClient(withInterceptors([jwtInterceptor])), 
    
    provideAnimationsAsync()
  ]
};