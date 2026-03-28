import { provideZoneChangeDetection } from "@angular/core";
import {
  bootstrapApplication,
  BootstrapContext,
} from '@angular/platform-browser';
import { config } from './app/app.config.server';
import { SplashComponent } from './app/splash.component';

const bootstrap = (context: BootstrapContext) =>
  bootstrapApplication(SplashComponent, {...config, providers: [provideZoneChangeDetection(), ...config.providers]}, context);

export default bootstrap;
