import { TestBed } from '@angular/core/testing';
import { SwUpdate, VersionEvent } from '@angular/service-worker';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { SwUpdateService } from './sw-update.service';

describe('SwUpdateService', () => {
  let service: SwUpdateService;
  let versionUpdatesSubject: BehaviorSubject<VersionEvent>;
  let mockSwUpdate: Pick<
    jest.Mocked<SwUpdate>,
    'isEnabled' | 'versionUpdates' | 'activateUpdate'
  >;
  let mockLocation: Pick<jest.Mocked<Location>, 'reload'>;

  beforeEach(() => {
    versionUpdatesSubject = new BehaviorSubject({
      type: 'VERSION_DETECTED',
    } as VersionEvent);
    mockSwUpdate = {
      isEnabled: true,
      versionUpdates: versionUpdatesSubject.asObservable(),
      activateUpdate: jest.fn().mockResolvedValue(undefined),
    };
    mockLocation = {
      reload: jest.fn().mockName('reload'),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: SwUpdate, useValue: mockSwUpdate },
        { provide: Window, useValue: { location: mockLocation } },
        SwUpdateService,
      ],
    });

    service = TestBed.inject(SwUpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit true when a new version is ready', async () => {
    versionUpdatesSubject.next({ type: 'VERSION_READY' } as VersionEvent);

    const isUpdateAvailable = await firstValueFrom(service.updateAvailable$);
    expect(isUpdateAvailable).toBe(true);
  });

  it('should not emit when other version update events occur', async () => {
    versionUpdatesSubject.next({
      type: 'VERSION_INSTALLATION_FAILED',
    } as VersionEvent);

    const isUpdateAvailable = await firstValueFrom(service.updateAvailable$);
    expect(isUpdateAvailable).toBe(false);
  });

  it('should activate update and reload page', async () => {
    await service.activateUpdate();

    expect(mockSwUpdate.activateUpdate).toHaveBeenCalled();
    expect(mockLocation.reload).toHaveBeenCalled();
  });

  it('should emit false after activating update', async () => {
    // First emit true
    versionUpdatesSubject.next({ type: 'VERSION_READY' } as VersionEvent);
    let isUpdateAvailable = await firstValueFrom(service.updateAvailable$);
    expect(isUpdateAvailable).toBe(true);

    // Activate update
    await service.activateUpdate();

    // Should now be false
    isUpdateAvailable = await firstValueFrom(service.updateAvailable$);
    expect(isUpdateAvailable).toBe(false);
  });
});
