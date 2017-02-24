/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';

import { TrailMemoryService } from './trail-memory.service';
import { Trail } from './../objects';

describe('TrailMemoryService', () => {

  var service;

  var cleanUpRepository = function(){
    if(service){
      service.getTrails().subscribe(res => {
        let trails = res._values;
        trails.forEach( trail => {
          service.removeTrail(trail).subscribe();
        });
      });
    }
  };
  var loadTrails = function(){
    if(service){
      (<Trail[]>
        [
          new Trail("Test 1"),
          new Trail("Test 2"),
          new Trail("Test 3")
        ]
      ).forEach( trail => {
        service.saveTrail(trail).subscribe();
      } );
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TrailMemoryService]
    });
    service = TestBed.get(TrailMemoryService);
  });

  it('should exist.', () => {
    expect(service).toBeTruthy();
  });

  it('should save a trail', async(() => {
    let nTrails : number;
    service.getTrails().subscribe(res => {
      nTrails = res._values.length;
    }, error => {}, () => {});
    
    service.saveTrail(service.createTrail('test.1')).subscribe(res => console.log(res._msg));
    let nTrailsResult : number;
    service.getTrails().subscribe(res => {
      nTrailsResult = res._values.length;
    });
    expect( nTrailsResult ).toBe( nTrails + 1 );
  }));


  it('should return all saved trails', async(() => {
    cleanUpRepository();
    loadTrails();
    let trails = [];
    service.getTrails().subscribe( res => {
      if(res.success){
        trails = res._values;
      } else {
        console.error(res._msg);
      }
    });
    expect(trails.length).toBe(3);
  }));
  
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
