import {
  bootstrapApplication,
  BootstrapContext,
} from '@angular/platform-browser';
import { config } from './app/app.config.server';
import { SplashComponent } from './app/splash.component';

const bootstrap = (context: BootstrapContext) =>
  bootstrapApplication(SplashComponent, config, context);

export default bootstrap;
