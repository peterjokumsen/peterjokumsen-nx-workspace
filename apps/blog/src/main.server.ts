import { bootstrapApplication } from '@angular/platform-browser';
import { config } from './app/app.config.server';
import { SplashComponent } from './app/splash.component';

const bootstrap = () => bootstrapApplication(SplashComponent, config);

export default bootstrap;
