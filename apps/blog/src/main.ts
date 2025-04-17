import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { SplashComponent } from './app/splash.component';

bootstrapApplication(SplashComponent, appConfig).catch((err) =>
  console.error(err),
);
