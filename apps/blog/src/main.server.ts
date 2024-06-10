import { SplashComponent } from './app/splash.component';
import { bootstrapApplication } from '@angular/platform-browser';
import { config } from './app/app.config.server';

const bootstrap = () => bootstrapApplication(SplashComponent, config);

export default bootstrap;
