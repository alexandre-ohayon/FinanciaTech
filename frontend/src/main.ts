import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { jwtInterceptor } from './app/core/interceptors/jwt.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Importer le module des animations
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { importProvidersFrom } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importer CommonModule pour les directives

bootstrapApplication(AppComponent, {
  providers: [
    ...appConfig.providers,
    provideHttpClient(withInterceptors([jwtInterceptor])), // Intercepteur pour gérer les requêtes HTTP
    importProvidersFrom(BrowserAnimationsModule), // Ajout de BrowserAnimationsModule ici
    importProvidersFrom(CommonModule), // Importer CommonModule ici
  ]
});
