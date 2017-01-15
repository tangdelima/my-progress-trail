/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TrailService } from './trail.service';

describe('TrailServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TrailService]
    });
  });

  it('should ...', inject([TrailService], (service: TrailService) => {
    expect(service).toBeTruthy();
  }));
});
