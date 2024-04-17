import { TestBed } from '@angular/core/testing';

import { PoseidonService } from './poseidon.service';

describe('PoseidonService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PoseidonService = TestBed.get(PoseidonService);
    expect(service).toBeTruthy();
  });
});
