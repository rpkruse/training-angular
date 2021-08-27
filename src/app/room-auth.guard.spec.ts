import { TestBed } from '@angular/core/testing';

import { RoomAuthGuard } from './room-auth.guard';

describe('RoomAuthGuard', () => {
  let guard: RoomAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(RoomAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
