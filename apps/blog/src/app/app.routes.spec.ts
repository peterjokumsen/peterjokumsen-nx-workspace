import { Route } from '@angular/router';
import { appRoutes } from './app.routes';

describe('appRoutes', () => {
  describe.each([
    // keep split
    '',
    // 'blog', // uncomment when blog functional
    'development-notes',
  ])('path "%s"', (path) => {
    let route: Route | undefined;

    beforeEach(() => {
      route = appRoutes.find((r) => r.path === path);
    });

    it('should be defined', () => {
      expect(route).toBeDefined();
    });

    it('should have a title', () => {
      expect(route?.data?.['title']).toBeDefined();
    });

    it('should lazy load component or child routes', () => {
      expect(route?.loadComponent || route?.loadChildren).toBeDefined();
    });
  });

  describe('last route', () => {
    let lastRoute: Route;

    beforeEach(() => {
      lastRoute = appRoutes[appRoutes.length - 1];
    });

    it('should be a wildcard route to display not-found component', () => {
      expect(lastRoute.path).toBe('**');
    });

    it('should be lazy loaded', () => {
      expect(lastRoute.loadComponent).toBeDefined();
      expect(lastRoute.component).toBeUndefined();
    });
  });
});
