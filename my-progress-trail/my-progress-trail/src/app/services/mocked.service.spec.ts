/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MockedService } from './mocked.service';

describe('MockedService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MockedService]
    });
  });

  it('should exist.', inject([MockedService], (service: MockedService) => {
    expect(service).toBeTruthy();
  }));

  it('should save a trail');

  it('should return all saved trails');
  
  it('should return an expected saved trail');

  it('should edit an expected trail');

  it('should remove a given trail');

  it('should create a goal');

  it('should attach a goal to a trail');

  it('should remove a goal froma a trail');

  it('should finish a goal');

  it('should complete a trail when all goals finished');

  it('should only have completed status when all goals are finished');

});
