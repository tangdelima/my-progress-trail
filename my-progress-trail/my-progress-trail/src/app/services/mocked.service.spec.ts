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

  it('should save a trail', async((inject([MockedService], (service : MockedService) => {
    let nTrails : number;
    service.getTrails().subscribe(trails => {
      nTrails = trails.length;
    }, error => {}, () => {});
    
    service.saveTrail(service.createTrail('test.1')).subscribe(res => console.log(res.msg));
    let nTrailsResult : number;
    service.getTrails().subscribe(trails => {
      nTrailsResult = trails.length;
    });
    expect( nTrailsResult ).toBe( nTrails + 1 );
  }))));


  it('should return all saved trails', () => {
    pending();
  });
  
  it('should return an expected saved trail', () => {
    pending();
  });

  it('should edit an expected trail', () => {
    pending();
  });

  it('should remove a given trail', () => {
    pending();
  });

  it('should create a goal', () => {
    pending();
  });

  it('should attach a goal to a trail', () => {
    pending();
  });

  it('should remove a goal froma a trail', () => {
    pending();
  });

  it('should finish a goal', () => {
    pending();
  });

  it('should complete a trail when all goals finished', () => {
    pending();
  });

  it('should only have completed status when all goals are finished', () => {
    pending();
  });

  it('should only take off trail completed status when one of its goals is marked unfinished', () => {
    pending();
  });

});
