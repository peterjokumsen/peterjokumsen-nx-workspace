import { SplashComponent } from './app/splash.component';
import { appConfig } from './app/app.config';
import { bootstrapApplication } from '@angular/platform-browser';

bootstrapApplication(SplashComponent, appConfig).catch((err) =>
  console.error(err),
);
