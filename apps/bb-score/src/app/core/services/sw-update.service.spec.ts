import { TestBed } from '@angular/core/testing';
import { SwUpdate, VersionEvent } from '@angular/service-worker';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { UpdateStatus } from '../models';
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

  describe('status$', () => {
    const cases: Array<[VersionEvent['type'], UpdateStatus]> = [
      ['VERSION_DETECTED', 'updating'],
      ['NO_NEW_VERSION_DETECTED', 'current'],
      ['VERSION_INSTALLATION_FAILED', 'failed'],
      ['VERSION_READY', 'updated'],
    ];

    describe.each(cases)(
      'when version event type is "%s"',
      (type, expectedStatus) => {
        it(`should emit "${expectedStatus}"`, async () => {
          versionUpdatesSubject.next({ type } as VersionEvent);

          const actual = await firstValueFrom(service.status$);
          expect(actual).toBe(expectedStatus);
        });
      },
    );
  });

  describe('activateUpdate', () => {
    beforeEach(async () => {
      versionUpdatesSubject.next({ type: 'VERSION_READY' } as VersionEvent);
      await service.activateUpdate();
    });

    it('should activate update and reload page', () => {
      expect(mockSwUpdate.activateUpdate).toHaveBeenCalled();
      expect(mockLocation.reload).toHaveBeenCalled();
    });

    it('should emit "current" status after activating update', async () => {
      const latestStatus = await firstValueFrom(service.status$);
      expect(latestStatus).toEqual('current');
    });
  });
});
