import { MdComponentMapService } from './md-component-map.service';
import { TestBed } from '@angular/core/testing';

describe('MdComponentMapService', () => {
  let service: MdComponentMapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MdComponentMapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
