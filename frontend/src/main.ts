import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { jwtInterceptor } from './app/core/interceptors/jwt.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    ...appConfig.providers,
    provideHttpClient(withInterceptors([jwtInterceptor])),
  ],
});
